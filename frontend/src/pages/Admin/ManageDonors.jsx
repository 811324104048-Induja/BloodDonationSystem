import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

const ManageDonors = () => {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const response =
        await api.get("/admin/donors");

      setDonors(
        response.data.donors ||
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

          <h1>Manage Donors</h1>

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Blood</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Availability</th>
                </tr>

              </thead>

              <tbody>

                {donors.map((donor) => (

                  <tr key={donor.donor_id}>

                    <td>{donor.name}</td>

                    <td>
                      {donor.blood_group}
                    </td>

                    <td>{donor.city}</td>

                    <td>{donor.phone}</td>

                    <td>
                      {donor.available
                        ? "Available"
                        : "Unavailable"}
                    </td>

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

export default ManageDonors;