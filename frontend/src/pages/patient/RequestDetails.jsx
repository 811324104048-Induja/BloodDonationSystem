
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import matchService from "../../services/matchService";

function RequestDetails() {
  const { id: requestId } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await matchService.getMatchesForRequest(requestId);

        const result = Array.isArray(response)
          ? response
          : Array.isArray(response?.matches)
          ? response.matches
          : [];

        if (active) {
          setMatches(result);
        }
      } catch (err) {
        console.error("Error fetching matched donors:", err);

        if (active) {
          setMatches([]);
          setError(
            err?.response?.data?.message ||
              "Unable to load matched donors. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (requestId) {
      fetchMatches();
    } else {
      setError("Blood request ID is missing.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [requestId]);

  const getStatus = (status) =>
    String(status || "PENDING").toUpperCase();

  const getStatusStyle = (status) => {
    const value = getStatus(status);

    if (value === "ACCEPTED") {
      return {
        background: "#dcfce7",
        color: "#166534",
        dot: "#16a34a",
      };
    }

    if (value === "REJECTED") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
        dot: "#dc2626",
      };
    }

    if (value === "COMPLETED") {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
        dot: "#2563eb",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
      dot: "#d97706",
    };
  };

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e8edf3",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 4px 18px rgba(15, 23, 42, 0.04)",
  };

  const headingStyle = {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    margin: "0 0 10px",
  };

  const cellStyle = {
    padding: "17px 20px",
    textAlign: "left",
    borderBottom: "1px solid #edf0f5",
    fontSize: "14px",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#172033",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }

        .bc-back:hover {
          background: #f1f5f9 !important;
        }

        .bc-row:hover {
          background: #f8fbff;
        }

        .bc-refresh:hover {
          background: #1d4ed8 !important;
        }

        @media (max-width: 640px) {
          .bc-main {
            padding: 18px 12px !important;
          }

          .bc-header {
            padding: 18px !important;
          }

          .bc-title {
            font-size: 23px !important;
          }

          .bc-card {
            padding: 16px !important;
          }
        }
      `}</style>

      {/* Top navigation */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e8edf3",
          padding: "15px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "11px",
          }}
        >
          <div
            style={{
              width: "43px",
              height: "43px",
              borderRadius: "13px",
              background: "#dc2626",
              display: "grid",
              placeItems: "center",
              color: "#ffffff",
              fontSize: "23px",
            }}
          >
            ♥
          </div>

          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
              }}
            >
              Blood<span style={{ color: "#dc2626" }}>Connect</span>
            </div>

            <div style={{ fontSize: "11px", color: "#64748b" }}>
              Every drop makes a difference
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bc-back"
          style={{
            padding: "10px 15px",
            border: "1px solid #dbe2ea",
            borderRadius: "9px",
            background: "#ffffff",
            color: "#334155",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </header>

      <main
        className="bc-main"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "34px 24px",
        }}
      >
        {/* Page heading */}
        <div
          className="bc-header"
          style={{
            background:
              "linear-gradient(120deg, #991b1b 0%, #dc2626 65%, #ef4444 100%)",
            borderRadius: "20px",
            padding: "30px",
            color: "#ffffff",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "1.5px",
              color: "#fee2e2",
              marginBottom: "10px",
            }}
          >
            PATIENT DASHBOARD / MATCHING
          </div>

          <h1
            className="bc-title"
            style={{
              fontSize: "30px",
              margin: "0 0 10px",
              fontWeight: "800",
              letterSpacing: "-0.8px",
            }}
          >
            Matched Donors
          </h1>

          <p
            style={{
              color: "#fee2e2",
              margin: 0,
              fontSize: "14px",
              lineHeight: 1.7,
              maxWidth: "550px",
            }}
          >
            View compatible donors for your blood request and
            track their response status in one place.
          </p>
        </div>

        {/* Request summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "18px",
            marginBottom: "24px",
          }}
        >
          <div className="bc-card" style={cardStyle}>
            <p style={headingStyle}>BLOOD REQUEST</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  background: "#fee2e2",
                  display: "grid",
                  placeItems: "center",
                  color: "#dc2626",
                  fontSize: "23px",
                }}
              >
                ♡
              </div>

              <div>
                <div style={{ fontSize: "22px", fontWeight: "800" }}>
                  #{requestId || "—"}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Request ID
                </div>
              </div>
            </div>
          </div>

          <div className="bc-card" style={cardStyle}>
            <p style={headingStyle}>MATCHED DONORS</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  background: "#dbeafe",
                  display: "grid",
                  placeItems: "center",
                  color: "#2563eb",
                  fontSize: "22px",
                }}
              >
                ♙
              </div>

              <div>
                <div style={{ fontSize: "22px", fontWeight: "800" }}>
                  {loading ? "—" : matches.length}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Compatible matches
                </div>
              </div>
            </div>
          </div>

          <div className="bc-card" style={cardStyle}>
            <p style={headingStyle}>ACCEPTED DONORS</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  background: "#dcfce7",
                  display: "grid",
                  placeItems: "center",
                  color: "#15803d",
                  fontSize: "22px",
                }}
              >
                ✓
              </div>

              <div>
                <div style={{ fontSize: "22px", fontWeight: "800" }}>
                  {
                    matches.filter(
                      (match) => getStatus(match.status) === "ACCEPTED"
                    ).length
                  }
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Accepted requests
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donor table */}
        <section className="bc-card" style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "8px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "19px",
                  fontWeight: "800",
                  margin: "0 0 7px",
                }}
              >
                Donor Details
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  margin: 0,
                }}
              >
                Donor contact details and matching status
              </p>
            </div>

            <span
              style={{
                background: "#f1f5f9",
                color: "#475569",
                padding: "7px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {loading ? "Loading..." : `${matches.length} donors`}
            </span>
          </div>

          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "55px 15px",
                color: "#64748b",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>
                ♥
              </div>
              Loading matched donors...
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                marginTop: "20px",
                padding: "18px",
                borderRadius: "12px",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: "14px",
              }}
            >
              <strong>Unable to load donors</strong>
              <p style={{ marginBottom: 0 }}>{error}</p>

              <button
                type="button"
                className="bc-refresh"
                onClick={() => window.location.reload()}
                style={{
                  marginTop: "12px",
                  padding: "9px 14px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && matches.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "55px 15px",
              }}
            >
              <div
                style={{
                  width: "66px",
                  height: "66px",
                  borderRadius: "50%",
                  background: "#fff1f2",
                  color: "#e11d48",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "30px",
                  margin: "0 auto 16px",
                }}
              >
                ♥
              </div>

              <h3 style={{ margin: "0 0 8px", fontSize: "17px" }}>
                No matched donors yet
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                Compatible donor details will appear here
                when matches are available for this request.
              </p>
            </div>
          )}

          {!loading && !error && matches.length > 0 && (
            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "650px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f8fafc",
                      color: "#64748b",
                    }}
                  >
                    <th style={cellStyle}>DONOR NAME</th>
                    <th style={cellStyle}>PHONE NUMBER</th>
                    <th style={cellStyle}>MATCH SCORE</th>
                    <th style={cellStyle}>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {matches.map((match, index) => {
                    const status = getStatus(match.status);
                    const statusStyle = getStatusStyle(status);
                    const score = match.matchScore;

                    return (
                      <tr
                        key={
                          match.matchId ??
                          `${match.donorId ?? "donor"}-${index}`
                        }
                        className="bc-row"
                      >
                        <td style={cellStyle}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "39px",
                                height: "39px",
                                flexShrink: 0,
                                borderRadius: "50%",
                                background: "#fee2e2",
                                color: "#b91c1c",
                                display: "grid",
                                placeItems: "center",
                                fontWeight: "800",
                                fontSize: "16px",
                              }}
                            >
                              {(match.donorName || "D")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span style={{ fontWeight: "700", color: "#1e293b" }}>
                              {match.donorName || "Name unavailable"}
                            </span>
                          </div>
                        </td>

                        <td style={{ ...cellStyle, color: "#475569" }}>
                          {match.phoneNumber || "Not provided"}
                        </td>

                        <td style={cellStyle}>
                          {score != null ? (
                            <div style={{ minWidth: "105px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  marginBottom: "7px",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "800",
                                    color: "#1d4ed8",
                                  }}
                                >
                                  {score}%
                                </span>
                              </div>

                              <div
                                style={{
                                  width: "90px",
                                  height: "5px",
                                  background: "#e2e8f0",
                                  borderRadius: "10px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${Math.max(
                                      0,
                                      Math.min(100, Number(score) || 0)
                                    )}%`,
                                    height: "100%",
                                    background: "#3b82f6",
                                    borderRadius: "10px",
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>

                        <td style={cellStyle}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "7px 11px",
                              borderRadius: "20px",
                              background: statusStyle.background,
                              color: statusStyle.color,
                              fontSize: "11px",
                              fontWeight: "800",
                              letterSpacing: "0.3px",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: statusStyle.dot,
                              }}
                            />
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              borderTop: "1px solid #edf0f5",
              marginTop: "20px",
              paddingTop: "16px",
              color: "#94a3b8",
              fontSize: "12px",
              lineHeight: 1.7,
            }}
          >
            Donor information is displayed based on the matching
            data returned by BloodConnect.
          </div>
        </section>
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        BloodConnect · Connecting donors with those in need
      </footer>
    </div>
  );
}

export default RequestDetails;