"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Play } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(147, 51, 234, 0.3)",
        zIndex: 50,
        padding: "0 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "80px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(to right, #9333ea, #3b82f6)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play
              style={{
                width: "20px",
                height: "20px",
                color: "white",
                fill: "white",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
              display: "none",
            }}
            className="hidden sm:inline"
          >
            CineVerse
          </span>
        </Link>

        {/* Desktop Menu */}
        <div
          style={{ display: "none", gap: "32px" }}
          className="hidden md:flex"
        >
          <Link href="/" style={{ color: "#d1d5db", textDecoration: "none" }}>
            Home
          </Link>
          <Link
            href="/movies"
            style={{ color: "#d1d5db", textDecoration: "none" }}
          >
            Movies
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div
          style={{ display: "none", gap: "16px", alignItems: "center" }}
          className="hidden md:flex"
        >
          <input
            type="text"
            placeholder="Search..."
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.5)",
              color: "white",
              borderRadius: "9999px",
              padding: "6px 16px",
              border: "1px solid rgba(147, 51, 234, 0.2)",
              fontSize: "14px",
              outline: "none",
              width: "120px",
            }}
          />
          <button
            style={{
              color: "#d1d5db",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Sign In
          </button>
          <button
            className="btn-primary"
            style={{ fontSize: "14px", padding: "8px 24px" }}
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
          className="md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            borderTop: "1px solid rgba(147, 51, 234, 0.2)",
            padding: "16px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "block",
              color: "#d1d5db",
              textDecoration: "none",
              padding: "8px 12px",
            }}
          >
            Home
          </Link>
          <Link
            href="/movies"
            style={{
              display: "block",
              color: "#d1d5db",
              textDecoration: "none",
              padding: "8px 12px",
            }}
          >
            Movies
          </Link>
          <button
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "8px",
              background: "transparent",
              border: "1px solid #9333ea",
              color: "#a78bfa",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Sign In
          </button>
          <button
            className="btn-primary"
            style={{ width: "100%", marginTop: "8px", fontSize: "14px" }}
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}
