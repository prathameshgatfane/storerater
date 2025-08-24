import React, { useEffect } from "react";
import "./Home.css"; // Ensure your Home.css handles general styles

const featuredStores = [
  { id: 1, name: "UniqueIndia", description: "Top rated store in India.", rating: 4.5 },
  { id: 2, name: "TechHub", description: "Best gadgets and devices.", rating: 4.8 },
  { id: 3, name: "FashionFiesta", description: "Latest trends in fashion.", rating: 4.3 },
];

const blogPosts = [
  { id: 1, title: "How StoreRater Works", excerpt: "Learn how we bring you honest store ratings." },
  { id: 2, title: "Top 10 Rated Stores This Month", excerpt: "Check out the top stores our users love." },
  { id: 3, title: "Why Ratings Matter", excerpt: "Understanding the power of customer reviews." },
];

export default function Home() {

  useEffect(() => {
    // Animate hero section
    const hero = document.querySelector(".home-hero");
    hero && (hero.style.opacity = 1);
    // Fade stores and articles
    document.querySelectorAll(".fade-in").forEach((el, idx) =>
      setTimeout(() => (el.style.opacity = 1), 400 + idx * 200)
    );
  }, []);

  return (
    <div className="container home-container">
      {/* Hero section with magenta gradient */}
      <section
        className="home-hero rounded shadow-lg text-center px-4 py-5 mb-5"
        style={{
          background: "linear-gradient(90deg,#D0008B 30%,#F554A6 90%)",
          color: "#fff",
        }}
      >
        <h1
          className="display-3 mb-3"
          style={{
            fontFamily: "Montserrat,sans-serif",
            fontWeight: "700",
            letterSpacing: "1.5px",
            textShadow: "0 2px 5px #7a155e"
          }}
        >
          Find The Best Stores Near You
        </h1>
        <p
          className="lead mb-4"
          style={{
            fontFamily: "Open Sans,sans-serif",
            fontWeight: "600",
            fontSize: "1.3rem"
          }}
        >
          Honest reviews and ratings from genuine customers.
        </p>
        <a href="/stores"
           className="btn magenta-btn btn-lg px-5 py-2 shadow-lg home-cta"
           style={{
             borderRadius: "30px", fontWeight: "700", transition: "transform 0.2s",
             background: "linear-gradient(90deg,#D0008B 60%,#F554A6 100%)",
             color: "#fff", border: "none"
           }}>
          Explore Stores
        </a>
      </section>

      {/* Featured Stores with magenta accents */}
      <section className="mb-5 fade-in" style={{ opacity: 0, transition: "opacity 0.8s" }}>
        <h2 className="mb-4" style={{ fontFamily: "Montserrat", fontWeight: 700 }}>Featured Stores</h2>
        <div className="row">
          {featuredStores.map(store => (
            <div key={store.id} className="col-md-4 mb-4">
              <div
                className="card h-100 shadow-sm home-card"
                style={{
                  fontFamily: "Open Sans",
                  borderRadius: "16px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  border: "2px solid #D0008B"
                }}
              >
                <img
                  src={`https://source.unsplash.com/400x300/?shop,store,${store.name}`}
                  alt={store.name}
                  className="card-img-top"
                  style={{ borderRadius: "16px 16px 0 0", height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ fontFamily: "Montserrat", fontWeight: 700 }}>{store.name}</h5>
                  <p className="card-text">{store.description}</p>
                  <div className="mb-2">
                    <span className="badge" style={{
                      background: "linear-gradient(90deg,#D0008B 60%,#F554A6 100%)",
                      color: "#fff", fontSize: "1rem"
                    }}>
                      {store.rating} &#11088;
                    </span>
                  </div>
                  <a
                    href="/stores"
                    className="btn magenta-btn btn-sm px-3"
                    style={{
                      borderRadius: "20px", fontWeight: "600",
                      background: "linear-gradient(90deg,#D0008B 60%,#F554A6 100%)",
                      color: "#fff", border: "none"
                    }}
                  >
                    View Store
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Posts */}
      <section className="mb-5 fade-in" style={{ opacity: 0, transition: "opacity 0.8s" }}>
        <h2 className="mb-4" style={{ fontFamily: "Montserrat", fontWeight: 700 }}>Latest Articles</h2>
        <div className="row">
          {blogPosts.map(post => (
            <div key={post.id} className="col-md-4 mb-3">
              <a
                href={`/blog/${post.id}`}
                className="card card-body blog-card shadow-sm"
                style={{
                  fontFamily: "Open Sans",
                  borderRadius: "14px",
                  transition: "transform 0.2s",
                  textDecoration: "none",
                  color: "#222"
                }}
              >
                <h5 className="mb-2" style={{ fontFamily: "Montserrat", fontWeight: 700 }}>{post.title}</h5>
                <p className="mb-1">{post.excerpt}</p>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="text-center p-4 bg-light rounded fade-in mb-3" style={{ opacity: 0, transition: "opacity 0.8s" }}>
        <h2 style={{ fontFamily: "Montserrat", fontWeight: 700 }}>About StoreRater</h2>
        <p className="lead mt-2" style={{ fontFamily: "Open Sans", fontWeight: "600" }}>
          StoreRater helps you discover, rate, and review the best stores with real customer feedback.
          Join our community and unlock trusted shopping experiences.
        </p>
      </section>
    </div>
  );
}
