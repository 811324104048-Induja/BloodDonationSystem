import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import donorService from "../../services/donorService";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await donorService.getDonationHistory();

      setDonations(
        Array.isArray(data)
          ? data
          : data.donations || []
      );
    } catch (error) {
      console.error("Failed to load donation history:", error);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="main-content">

          <h1>Donation History</h1>

          {loading ? (
            <div className="empty-state">
              Loading donation history...
            </div>
          ) : donations.length === 0 ? (
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
                    <th>Units Donated</th>
                  </tr>
                </thead>

                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.donationId}>

                      <td>
                        {donation.donationDate || "-"}
                      </td>

                      <td>
                        {donation.hospitalName || "-"}
                      </td>

                      <td>
                        {donation.unitsDonated ?? 0}
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