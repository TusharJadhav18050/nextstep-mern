import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import api from "../../utils/api";

function FeaturedBanner() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/companies/featured")
      .then(res => setCompanies(res.data.companies))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{ fontWeight: 700, color: "#6b7280", marginBottom: 16 }}>
        See Jobs in Featured Companies
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
        {loading
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} width={80} height={30} />)
          : companies.map((comp) => (
              <Link key={comp._id} to="/companies">
                <img src={comp.logo_url} alt={comp.company_name}
                  style={{ width: 80, height: 30, objectFit: "contain" }} />
              </Link>
            ))}
      </div>
    </div>
  );
}

export default FeaturedBanner;
