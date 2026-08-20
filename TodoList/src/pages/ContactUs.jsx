function ContactUs() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Contact Us</h1>
        <p className="text-secondary">
          We'd love to hear from you
        </p>
      </div>

      <div className="row justify-content-center g-4">

        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center h-100">
            <div className="card-body p-4">
              <div className="fs-1 mb-3">📧</div>
              <h5 className="fw-bold">Email</h5>
              <p className="text-secondary mb-0">
                support@todoapp.com
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center h-100">
            <div className="card-body p-4">
              <div className="fs-1 mb-3">📱</div>
              <h5 className="fw-bold">Phone</h5>
              <p className="text-secondary mb-0">
                +20 100 000 0000
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center h-100">
            <div className="card-body p-4">
              <div className="fs-1 mb-3">📍</div>
              <h5 className="fw-bold">Location</h5>
              <p className="text-secondary mb-0">
                Cairo, Egypt
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactUs;