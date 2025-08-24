import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-4 mt-5">
      <div className="container">
        <div className="row">

          {/* Company Info */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">StoreRater</h5>
            <p>Your trusted platform for honest store reviews and ratings.</p>
            <div>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light me-3">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-light me-3">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light me-3">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-light">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/stores" className="text-light text-decoration-none">Stores</a></li>
              <li><a href="/dashboard" className="text-light text-decoration-none">Admin Dashboard</a></li>
              
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Contact Us</h5>
            <p>Email: support@storerater.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 StoreRater St., Commerce City</p>
          </div>
        </div>

        <hr className="border-light" />

        <div className="text-center pb-3 small">
          &copy; {new Date().getFullYear()} StoreRater. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
