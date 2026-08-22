import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response =
        await api.get("/admin/users");

      setUsers(
        response.data.users ||
        response.data ||
        []
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <h1>Manage Users</h1>

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.user_id}>

                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>{user.created_at}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>
    </>
  );
};

export default ManageUsers;