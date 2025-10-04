import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Shop Lite</h5>
            <p>Your one-stop shop for all your needs.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/products" className="text-light">Products</a></li>
              <li><a href="/about" className="text-light">About Us</a></li>
              <li><a href="/contact" className="text-light">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <address>
              <p>123 Main Street<br />City, State 12345</p>
              <p>Email: info@shoplite.com<br />Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="row">
          <div className="col text-center mt-3">
            <p className="mb-0">&copy; {currentYear} Shop Lite. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;