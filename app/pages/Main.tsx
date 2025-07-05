"use client";

import React, { FormEvent, useState } from "react";
import styles from "../styles/main.module.css";

interface Option {
  value: string;
  label: string;
}

const serviceOptions: Record<"immigration" | "civic", Option[]> = {
  immigration: [
    { value: "study visa", label: "Study visa" },
    { value: "work visa", label: "Work visa" },
    { value: "spousal visa", label: "Spousal visa" },
  ],
  civic: [
    { value: "birth certificate", label: "Birth certificate" },
    { value: "id card", label: "ID card" },
    { value: "marriage certificate", label: "Marriage certificate" },
  ],
};

const Main = () => {
  const [service, setService] = useState<string>("");
  const [subService, setSubService] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, subService, query }),
      });
      const data = await res.json();
      setAnswer(data.data || "No reply 🤷‍♂️");
    } catch {
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const currentSubs = service
    ? serviceOptions[service as "immigration" | "civic"]
    : [];

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="logo" />
        </div>
        <div className={styles.github}>
          <a href="https://github.com/mfukechristian" target="_blank">
            Give a star on Github
          </a>
        </div>
      </header>

      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              Service
              <select
                value={service}
                onChange={(e) => {
                  setService(e.target.value);
                  setSubService("");
                }}
                required
              >
                <option value="">Select service</option>
                <option value="immigration">Immigration</option>
                <option value="civic">Civic</option>
              </select>
            </label>

            <label>
              Sub‑service
              <select
                value={subService}
                onChange={(e) => setSubService(e.target.value)}
                disabled={!service}
                required
              >
                <option value="">Select sub‑service</option>
                {currentSubs.map((opt: Option) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              More detail
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your situation…"
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Please wait…" : "Search"}
            </button>
          </form>
        </div>

        <div className={styles.responseContainer}>
          {answer || "See your request results here"}
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          <a
            href="https://www.linkedin.com/in/christian-mfuke-41b4b436a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made by Christian Mfuke
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Main;
