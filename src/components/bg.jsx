"use client";

export default function Bg({ children }) {
  return (
    <div className="bg-root">
      <div className="shape shape-one" />
      <div className="shape shape-two" />
      <div className="shape shape-three" />

      {/* IMPORTANT: this wrapper fixes your issue */}
      <main className="content">
        {children}
      </main>

      <style jsx>{`
        .bg-root {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #010018;
        }

        .shape {
          position: absolute;
          width: 70vw;
          height: 70vw;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.9;
          pointer-events: none;
        }

        .shape-one {
          background: radial-gradient(circle, #09006C, #06004a, transparent 70%);
          top: -20%;
          left: -20%;
        }

        .shape-two {
          background: radial-gradient(circle, #12007f, #05003a, transparent 70%);
          bottom: -25%;
          right: -15%;
        }

        .shape-three {
          background: radial-gradient(circle, rgba(9,0,108,.4), rgba(3,0,34,.6), transparent 70%);
          top: 30%;
          left: 20%;
        }

        .content {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          padding-top: 6rem; /* navbar space */
        }
      `}</style>
    </div>
  );
}
