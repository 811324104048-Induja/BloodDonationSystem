import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import requestService from "../../services/requestService";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data =
        await requestService.getMyRequests();

      setRequests(
        data.requests || data || []
      );

    } catch (error) {
      console.error(error);
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm(
      "Cancel this blood request?"
    )) {
      return;
    }

    try {
      await requestService.cancelRequest(id);

      loadRequests();

    } catch (error) {
      alert("Unable to cancel request");
    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <div className="page-header">

            <h1>My Blood Requests</h1>

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/patient/create-request")
              }
            >
              + New Request
            </button>

          </div>

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Blood</th>
                  <th>Units</th>
                  <th>Hospital</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {requests.map((request) => (

                  <tr
                    key={
                      request.request_id ||
                      request.id
                    }
                  >

                    <td>
                      {request.blood_group}
                    </td>

                    <td>
                      {request.units_required}
                    </td>

                    <td>
                      {request.hospital_name}
                    </td>

                    <td>
                      {request.urgency}
                    </td>

                    <td>
                      {request.status}
                    </td>

                    <td>

                      <button
                        onClick={() =>
                          navigate(
                            `/patient/requests/${
                              request.request_id ||
                              request.id
                            }`
                          )
                        }
                      >
                        View
                      </button>

                      {request.status !==
                        "Completed" &&
                        request.status !==
                        "Cancelled" && (

                          <button
                            className="reject-btn"
                            onClick={() =>
                              cancelRequest(
                                request.request_id ||
                                request.id
                              )
                            }
                          >
                            Cancel
                          </button>

                        )}

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

export default MyRequests;