import React, { useState, useEffect } from "react";
import styled from "styled-components";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = (userId, userName) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/admin/api/users/${deleteUserId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const updatedUsers = users.filter(user => user.id !== deleteUserId);
      setUsers(updatedUsers);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Error deleting user: ${error.message}`);
    }
  };

  const cancelDeleteUser = () => {
    setIsDeleteModalOpen(false);
  };

  const StyledWrapper = styled.div`
    button.delete-btn {
      width: 120px; /* Reduced width for mobile */
      height: 40px; /* Reduced height for mobile */
      cursor: pointer;
      display: flex;
      align-items: center;
      background: #e62222;
      border: none;
      border-radius: 5px;
      box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
    }

    button.delete-btn, button.delete-btn span {
      transition: 200ms;
    }

    button.delete-btn .text {
      transform: translateX(25px); /* Adjusted for smaller button */
      color: white;
      font-weight: bold;
      font-size: 14px; /* Smaller text for mobile */
    }

    button.delete-btn .icon {
      position: absolute;
      border-left: 1px solid #c41b1b;
      transform: translateX(90px); /* Adjusted for smaller button */
      height: 30px; /* Reduced height */
      width: 30px; /* Reduced width */
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button.delete-btn svg {
      width: 12px; /* Smaller icon for mobile */
      fill: #eee;
    }

    button.delete-btn:hover {
      background: #ff3636;
    }

    button.delete-btn:hover .text {
      color: transparent;
    }

    button.delete-btn:hover .icon {
      width: 120px; /* Match button width */
      border-left: none;
      transform: translateX(0);
    }

    button.delete-btn:focus {
      outline: none;
    }

    button.delete-btn:active .icon svg {
      transform: scale(0.8);
    }

    /* Media query for larger screens */
    @media (min-width: 640px) {
      button.delete-btn {
        width: 150px;
        height: 50px;
      }

      button.delete-btn .text {
        transform: translateX(35px);
        font-size: 16px;
      }

      button.delete-btn .icon {
        transform: translateX(110px);
        height: 40px;
        width: 40px;
      }

      button.delete-btn svg {
        width: 15px;
      }

      button.delete-btn:hover .icon {
        width: 150px;
      }
    }
  `;

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        User Management
      </h2>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 hidden sm:table-header-group">
              <tr>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="block sm:table-row-group">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="block sm:table-row hover:bg-gray-50 border-b sm:border-b-0 mb-4 sm:mb-0"
                  >
                    <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-base sm:text-lg border-b border-gray-200 before:content-['Name:'] before:font-bold before:mr-2 sm:before:content-none whitespace-normal">
                      {user.name}
                    </td>
                    <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-base sm:text-lg border-b border-gray-200 before:content-['Email:'] before:font-bold before:mr-2 sm:before:content-none whitespace-normal">
                      {user.email}
                    </td>
                    <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-base sm:text-lg border-b border-gray-200 before:content-['Role:'] before:font-bold before:mr-2 sm:before:content-none whitespace-normal">
                      {user.role}
                    </td>
                    <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-base sm:text-lg border-b border-gray-200 before:content-['Actions:'] before:font-bold before:mr-2 sm:before:content-none whitespace-normal">
                      <StyledWrapper>
                        <button
                          className="delete-btn noselect"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                        >
                          <span className="text">Delete</span>
                          <span className="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                            </svg>
                          </span>
                        </button>
                      </StyledWrapper>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="block sm:table-row">
                  <td
                    colSpan={4}
                    className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-center text-base sm:text-lg text-gray-500 whitespace-normal"
                  >
                    No users available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete user <strong>{deleteUserName}</strong>?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                onClick={confirmDeleteUser}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelDeleteUser}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;