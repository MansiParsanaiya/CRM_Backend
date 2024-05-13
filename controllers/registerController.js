const Register = require("../models/registerModel");
const Task = require("../models/taskModel");

exports.postEmployee = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email already exists
        const existingEmployee = await Register.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Find the maximum employeeID and increment it by 1
        const maxEmployee = await Register.findOne({}, { employeeID: 1 }, { sort: { employeeID: -1 } });
        const incrementedEmpID = maxEmployee ? maxEmployee.employeeID + 1 : 1;

        const employeeData = req.body;
        const newEmployee = new Register({
            ...employeeData,
            employeeID: incrementedEmpID
        });

        await newEmployee.save();

        res.status(200).json({ message: "Employee registered Successfully !", data: newEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// exports.getEmployee = async (req, res) => {
//     try {
//         let query = {};

//         if (req.query.value) {
//             const value = req.query.value;

//             if (req.query.key) {
//                 const searchField = req.query.key;

//                 if (['employeeID', 'firstName', 'lastName', 'email', 'role'].includes(searchField)) {
//                     query[searchField] = { $regex: new RegExp(value, 'i') };
//                 } else {
//                     return res.status(400).json({ error: 'Invalid search field' });
//                 }
//             }
//             else {
//                 query = {
//                     $or: [
//                         { employeeID: { $regex: new RegExp(value, 'i') } },
//                         { firstName: { $regex: new RegExp(value, 'i') } },
//                         { lastName: { $regex: new RegExp(value, 'i') } },
//                         { email: { $regex: new RegExp(value, 'i') } },
//                         { role: { $regex: new RegExp(value, 'i') } },
//                     ],
//                 };
//             }
//         }

//         const results = await Register.find(query).select('firstName lastName email role');

//         if (results.length > 0) {
//             res.json(results);
//         }
//         else {
//             res.json({ data: "No Data Found for the given value" });
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

exports.getEmployee = async (req, res) => {
    try {
        let query = {};
        let { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 documents per page

        // Convert page and limit to numbers
        page = parseInt(page);
        limit = parseInt(limit);

        if (req.query.value) {
            const value = req.query.value;

            if (req.query.key) {
                const searchField = req.query.key;

                if (['employeeID', 'firstName', 'lastName', 'email', 'role'].includes(searchField)) {
                    query[searchField] = { $regex: new RegExp(value, 'i') };
                } else {
                    return res.status(400).json({ error: 'Invalid search field' });
                }
            }
            else {
                query = {
                    $or: [
                        { employeeID: { $regex: new RegExp(value, 'i') } },
                        { firstName: { $regex: new RegExp(value, 'i') } },
                        { lastName: { $regex: new RegExp(value, 'i') } },
                        { email: { $regex: new RegExp(value, 'i') } },
                        { role: { $regex: new RegExp(value, 'i') } },
                    ],
                };
            }
        }

        const totalCount = await Register.countDocuments(query); // Count total documents matching the query

        const results = await Register.find(query)
            .select('firstName lastName email role')
            .limit(limit) // Limit the number of documents
            .skip((page - 1) * limit); // Skip documents based on the page number

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            docs: results,
            totalDocs: totalCount,
            limit: limit,
            totalPages: totalPages,
            page: page,
            pagingCounter: (page - 1) * limit + 1,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getRoleEmployeeData = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        let query = { role: 'Employee' };

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } },
                { state: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { gender: { $regex: search, $options: 'i' } },
            ];
        }

        const employees = await Register.paginate(query, options);
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEmployee = await Register.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// exports.deleteEmployee = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedEmployee = await Register.findByIdAndDelete(id);
//         res.json({ message: 'Employee deleted successfully', deletedEmployee });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the email of the employee to be deleted
        const deletedEmployee = await Register.findByIdAndDelete(id);

        // If employee is deleted successfully, remove their email from all tasks
        if (deletedEmployee) {
            const email = deletedEmployee.email;
            await Task.updateMany(
                { taskAssignees: email },
                { $pull: { taskAssignees: email } }
            );
        }

        res.json({ message: 'Employee deleted successfully', deletedEmployee });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getTotalEmployee = async (req, res) => {
    try {
        const totalEmployee = await Register.countDocuments();
        res.status(200).json(totalEmployee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getRole = async (req, res) => {

    const { employeeID } = req.body;

    if (!employeeID) {
        return res.status(400).json({ error: 'Employee ID is required' });
    }

    try {
        const user = await Register.findOne({ employeeID });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getRoleEmployee = async (req, res) => {
    try {
        const employees = await Register.find({ role: 'Employee' }, { firstName: 1, lastName: 1, email: 1, _id: 0 });

        const names = employees.map(employee => ({
            email: `${employee.email}`,
            employeeName: `${employee.firstName} ${employee.lastName}`
        }));

        res.json({ employees: names });

        console.log("Names:", names);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
