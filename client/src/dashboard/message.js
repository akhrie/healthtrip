import React, { useState } from 'react';

function Message() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:4040/message";

      const postData = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      };

      const response = await fetch(url, postData);
      const responseData = await response.json();
      alert(responseData.message);

      setMessage('');

    } catch (error) {
      console.error("Error:", error);
      alert("Error saving. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10  ms-auto me-auto">
          <form onSubmit={handleSubmit}>
            <h3>Message</h3>
            <textarea
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <br></br>
            <button type="submit" className="btn btn-primary mt-2">Submit</button>
          </form>
        </div>
      </div>
    </div>

  );
}

export default Message;
