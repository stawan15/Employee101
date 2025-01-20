import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Index({ employees, query }) {
    const [search, setSearch] = useState(query || '');
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // Handle search submit
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/employee', { search, filter, sortField, sortOrder });
    };

    // Handle sorting, update sortField and sortOrder
    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
    };

    // When sort parameters change, trigger a new fetch
    useEffect(() => {
        if (sortField) {
            router.get('/employee', { search, filter, sortField, sortOrder });
        }
    }, [sortField, sortOrder, search, filter]); // Dependencies include sortField, sortOrder, search, and filter

    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Employee List</h1>
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 mr-2"
                    placeholder="Search employees..."
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Search
                </button>
            </form>

            {employees.data.length > 0 ? (
                <>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th
                                    className="py-2 px-4 border cursor-pointer"
                                    onClick={() => handleSort('emp_no')}
                                >
                                    ID {sortField === 'emp_no' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="py-2 px-4 border cursor-pointer"
                                    onClick={() => handleSort('first_name')}
                                >
                                    First Name {sortField === 'first_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="py-2 px-4 border cursor-pointer"
                                    onClick={() => handleSort('last_name')}
                                >
                                    Last Name {sortField === 'last_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="py-2 px-4 border cursor-pointer"
                                    onClick={() => handleSort('birth_date')}
                                >
                                    Birthdate {sortField === 'birth_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="py-2 px-4 border cursor-pointer"
                                    onClick={() => handleSort('age')}
                                >
                                    Age {sortField === 'age' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.data.map((employee, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 border">{employee.emp_no}</td>
                                    <td className="py-2 px-4 border">{employee.first_name}</td>
                                    <td className="py-2 px-4 border">{employee.last_name}</td>
                                    <td className="py-2 px-4 border">{formatDate(employee.birth_date)}</td>
                                    <td className="py-2 px-4 border">{calculateAge(employee.birth_date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between mt-4">
                        {employees.prev_page_url && (
                            <button
                                onClick={() => router.get(employees.prev_page_url)}
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                Previous
                            </button>
                        )}
                        {employees.next_page_url && (
                            <button
                                onClick={() => router.get(employees.next_page_url)}
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className="py-4 text-center text-gray-500">
                    No employees found.
                </div>
            )}
        </div>
    );
}
