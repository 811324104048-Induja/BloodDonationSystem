import "./EditDonorProfile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import donorService from "../../services/donorService";

const EditDonorProfile = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    city: "",
    address: "",
    lastDonationDate: "",
    available: true,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    try {

      const data = await donorService.getProfile();

      const donor = data.donor || data;

      setForm({
        name: donor.user?.name || "",
        age: donor.age || "",
        gender: donor.gender || "",
        bloodGroup: donor.bloodGroup || "",
        phone: donor.user?.phone || "",
        city: donor.city || "",
        address: donor.address || "",
        lastDonationDate:
          donor.lastDonationDate || "",
        available:
          donor.available ?? true,
      });

    } catch (error) {

      console.error(
        "Failed to load donor profile:",
        error
      );
    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleAvailabilityChange = (e) => {

    setForm({
      ...form,
      available: e.target.value === "true",
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await donorService.updateProfile(form);

      alert("Profile updated successfully");

      navigate("/donor/profile");

    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Update failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <h1 className="edit-profile-title">
            Edit Donor Profile
          </h1>

          <form
            className="edit-profile-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <label>Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />


            {/* AGE */}

            <label>Age</label>

            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
            />


            {/* GENDER */}

            <label>Gender</label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >

              <option value="">
                Select
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>

            </select>


            {/* BLOOD GROUP */}

            <label>Blood Group</label>

            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              required
            >

              <option value="">
                Select
              </option>

              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>

            </select>


            {/* PHONE */}

            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />


            {/* CITY */}

            <label>City</label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />


            {/* ADDRESS */}

            <label>Address</label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
            />


            {/* LAST DONATION */}

            <label>
              Last Donation Date
            </label>

            <input
              type="date"
              name="lastDonationDate"
              value={form.lastDonationDate}
              onChange={handleChange}
            />


            {/* AVAILABILITY */}

            <label>
              Availability
            </label>

            <select
              name="available"
              value={String(form.available)}
              onChange={handleAvailabilityChange}
            >

              <option value="true">
                Available
              </option>

              <option value="false">
                Unavailable
              </option>

            </select>


            {/* SAVE */}

            <button
              type="submit"
              className="primary-btn"
            >
              Save Changes
            </button>

          </form>

        </main>

      </div>
    </>
  );
};

export default EditDonorProfile;