import React from "react";
import { useState, useEffect } from "react";
import { UserDetailsApi } from "../services/Api";
import Navbar from "../Components/Navbar";
import { logOut, isAuthenticated } from "../services/Auth";
import { useNavigate, Navigate } from "react-router-dom";
import "./Dashboard.css";
// pdf and excel
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import MailForm from "./MailForm";

function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiUrl = "http://localhost:8000";

  //email

  const [formData, setFormData] = useState({
    from_name: "",
    to_email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setError("");

    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);

            setTitle("");
            setDescription("");
            setMessage("Item added  successfuly");

            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("unable to create Todo item");
          }
        })
        .catch(() => {
          setError("unable to create Todo item");
        });

      setTodos([...todos, { title, description }]);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError("");

    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) => {
              if (item._id == editId) {
                item.title = editTitle;
                item.description = editDescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            setEditTitle("");
            setEditDescription("");
            setMessage("Item Uptated successfuly");

            setTimeout(() => {
              setMessage("");
            }, 3000);

            setEditId(-1);
          } else {
            setError("unable to create Todo item");
          }
        })
        .catch(() => {
          setError("unable to create Todo item");
        });
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to Delete")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  const navigate = useNavigate();

  const [User, setUser] = useState({ name: "", email: "", localId: "" });

  useEffect(() => {
    if (isAuthenticated()) {
      UserDetailsApi().then((response) => {
        setUser({
          name: response.data.users[0].displayName,
          email: response.data.users[0].email,
          localId: response.data.users[0].localId,
        });
      });
    }
  }, []);

  const logOutUser = () => {
    logOut();
    navigate("/login");
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  /////////////////////////////////////////////////////////////////
  //// pdf and excel

  const user = { name: "Kaleeshwaran", email: "kaleesh@example.com" };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add user details at the top
    doc.setFontSize(14);
    doc.text(`User: ${user.name}`, 14, 15);
    doc.text(`Email: ${user.email}`, 14, 25);

    // Add title below user info
    doc.setFontSize(16);
    doc.text("Tasks List", 14, 40);

    // Prepare table data
    const tableData = todos.map((item, index) => [
      index + 1,
      item.title,
      item.description,
    ]);

    // Generate table
    autoTable(doc, {
      startY: 50, // ensures table starts below header
      head: [["#", "Title", "Description"]],
      body: tableData,
    });

    // Save PDF
    doc.save("tasks.pdf");
  };

  const downloadExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add user details as a "User Info" sheet
    const userInfo = [
      ["Name", user.name],
      ["Email", user.email],
    ];
    const userSheet = XLSX.utils.aoa_to_sheet(userInfo);
    XLSX.utils.book_append_sheet(workbook, userSheet, "User Info");

    // Add tasks as "Tasks" sheet
    const taskData = todos.map((item, index) => ({
      No: index + 1,
      Title: item.title,
      Description: item.description,
    }));
    const taskSheet = XLSX.utils.json_to_sheet(taskData);
    XLSX.utils.book_append_sheet(workbook, taskSheet, "Tasks");

    // Export file
    XLSX.writeFile(workbook, "tasks.xlsx");
  };

  //////////////////////////////////////////////////////////////////

  // delete all task
  const deleteAllTasks = () => {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTodos([]); // clear state
      localStorage.removeItem("todos"); // clear from localStorage
    }
  };

  return (
    <div className="dash">
      <Navbar logOutUser={logOutUser} />
      <div className="kaleesh">
        <main role="main" className=" cont1  mt-5">
          <div className="container mass">
            <div className="text-center  mt-5">
              <h3> WELCOME</h3>
              {User.name && User.email && User.localId ? (
                <div className="row r1">
                  <div className="col c1">
                    <p className="text-bold ">
                      {" "}
                      Your name is :<span className="s2"> {User.name} </span>
                    </p>
                  </div>
                  <div className="col c2">
                    <p className="p1">
                      {" "}
                      Your email Is :<span className="s1"> {User.email}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p>loading...</p>
              )}
            </div>
          </div>
        </main>
      </div>

      <div className="converter">
        {/* email */}

        <MailForm />

        {/* pdf and excel */}

        <button
          className="btn bot mt-5 bg-white text-black"
          onClick={downloadPDF}
        >
          PDF DOWNLOAD
        </button>
        <button
          className="btn bot mt-5 bg-white text-black"
          onClick={downloadExcel}
        >
          EXCEL DOWNLOAD
        </button>
      </div>

      <div className="body">
        <div className="fluid mt-5 ">
          <div className=" h1 ">
            <h1 className="one text-white"> DASHBOARD </h1>
          </div>
          <div className="container2 ">
            <h3 className="text-white">Add Item</h3>
            {message && <p className="text-success"> {message}</p>}
            <div className="form-group d-flex   ">
              <input
                className="form-control "
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="TITTLE"
              />
              <input
                className="form-control "
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                type="text"
                placeholder="DETAILS"
              />
              <button className="btn btn-dark " onClick={handleSubmit}>
                Submit
              </button>
              <button
                className="btn btn-dark  delete  "
                onClick={deleteAllTasks}
              >
                Delete All
              </button>
            </div>
            {error && <p className="text-danger">{error}</p>}
          </div>

          <div className="contain">
            <h3 className="mt-3 text-white">Tasks</h3>
            <ul className="list-group">
              {todos.map((item) => (
                <li className="list-group-item bg-dark  text-white align-items-center d-flex justify-content-between mt-2">
                  <div className="d-flex flex-column ">
                    {editId == -1 || editId !== item._id ? (
                      <>
                        <span className="fw-bold bg-dark text-danger">
                          {item.title}
                        </span>
                        <span className="bg-dark">{item.description}</span>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="form-group d-flex   ">
                            <input
                              className="form-control "
                              onChange={(e) => setEditTitle(e.target.value)}
                              value={editTitle}
                              type="text"
                              placeholder="TITTLE"
                            />
                            <input
                              className="form-control "
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                              value={editDescription}
                              type="text"
                              placeholder="DETAILS"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="bg-dark">
                    {editId == -1 || editId !== item._id ? (
                      <button
                        className="btn btn1 btn-warning  "
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        className="btn btn3 btn-warning"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                    )}
                    {editId == -1 ? (
                      <button
                        className="btn btn2 btn-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        className="btn btn2 btn-danger "
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
