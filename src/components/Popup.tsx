import React, { useState } from "react";
import "../styles/Popup.css";

interface PopupProps {
  setUsername: (name: string) => void;
}

const Popup: React.FC<PopupProps> = ({ setUsername }) => {
  const [name, setName] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = () => {
    if (name.trim() !== "") {
      setUsername(name);
      localStorage.setItem("currentUser", name);
    }
  };

  return (
    <div className="page">
      <div className="popup">
        <div className="header">Enter Name</div>
        <input
          type="text"
          className="namefield"
          value={name}
          onChange={handleChange}
        />
        <button className="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Popup;
