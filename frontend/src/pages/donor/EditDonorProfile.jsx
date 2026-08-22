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
    blood_group: "",
    phone: "",
    city: "",
    address: "",
    last_donation_date: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await donorService.getProfile();

      const donor = data.donor || data;

      setForm({
        name: donor.name || "",
        age: donor.age || "",
        gender: donor.gender || "",
        blood_group: donor.blood_group || "",
        phone: donor.phone || "",
        city: donor.city || "",
        address: donor.address || "",
        last_donation_date:
          donor.last_donation_date || "",
      });

    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await donorService.updateProfile(form);

      alert("Profile updated successfully");

      navigate("/donor/profile");

    } catch (error) {
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

          <h1>Edit Donor Profile</h1>

          <form
            className="form-card"
            onSubmit={handleSubmit}
          >

            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
            />

            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>Blood Group</label>
            <select
              name="blood_group"
              value={form.blood_group}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />

            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
            />

            <label>Last Donation Date</label>
            <input
              type="date"
              name="last_donation_date"
              value={form.last_donation_date}
              onChange={handleChange}
            />

            <button className="primary-btn">
              Save Changes
            </button>

          </form>

        </main>

      </div>
    </>
  );
};

export default EditDonorProfile;