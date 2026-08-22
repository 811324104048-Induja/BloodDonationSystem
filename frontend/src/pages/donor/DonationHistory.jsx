import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import donorService from "../../services/donorService";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data =
        await donorService.getDonationHistory();

      setDonations(
        data.donations || data || []
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

          <h1>Donation History</h1>

          {donations.length === 0 ? (
            <div className="empty-state">
              No donation history available.
            </div>
          ) : (

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Hospital</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {donations.map((donation) => (

                    <tr
                      key={
                        donation.donation_id ||
                        donation.id
                      }
                    >

                      <td>
                        {donation.donation_date}
                      </td>

                      <td>
                        {donation.hospital_name}
                      </td>

                      <td>
                        {donation.blood_group}
                      </td>

                      <td>
                        {donation.units}
                      </td>

                      <td>
                        {donation.status}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </main>

      </div>
    </>
  );
};

export default DonationHistory;