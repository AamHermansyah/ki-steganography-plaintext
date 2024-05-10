'use client'

import { useState } from 'react'

function Team() {
  const [isHidden, setIsHidden] = useState(false);

  const handleHidden = () => {
    setIsHidden((prev) => !prev);
  }

  return (
    <div
      className="fixed bottom-2 left-2 text-xs bg-background/50 backdrop-blur-sm border py-2 px-3 rounded-sm transition-all duration-500 ease-in-out"
      style={{
        transform: isHidden ? 'translateX(-100%)' : 'translateX(0%)'
      }}
    >
      <h4 className="font-semibold">MK. Keamanan Informasi</h4>
      <p>Our teams:</p>
      <ul className="list-decimal list-inside">
        <li>Aam Hermansyah</li>
        <li>Gia Dwi Nur Anugrah</li>
        <li>Nadhilah Hazrati</li>
      </ul>
      <button
        onClick={handleHidden}
        className="absolute top-[50%] -translate-y-[50%] right-0 translate-x-[50%] p-1.5 border bg-white hover:bg-muted active:scale-95 rounded-sm transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="15px"
          height="15px"
          viewBox="0 0 32 32"
          version="1.1"
        >
          <g
            id="Page-1"
            stroke="none"
            strokeWidth={1}
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Icon-Set"
              transform="translate(-256.000000, -983.000000)"
              fill="#000000"
            >
              <path
                d="M286,1011 C286,1012.1 285.104,1013 284,1013 L260,1013 C258.896,1013 258,1012.1 258,1011 L258,987 C258,985.896 258.896,985 260,985 L284,985 C285.104,985 286,985.896 286,987 L286,1011 L286,1011 Z M284,983 L260,983 C257.791,983 256,984.791 256,987 L256,1011 C256,1013.21 257.791,1015 260,1015 L284,1015 C286.209,1015 288,1013.21 288,1011 L288,987 C288,984.791 286.209,983 284,983 L284,983 Z M267.744,989.313 C267.35,988.921 266.71,988.921 266.315,989.313 C265.92,989.707 265.92,990.344 266.315,990.736 L274.624,999.016 L266.315,1007.29 C265.92,1007.69 265.92,1008.33 266.315,1008.72 C266.71,1009.11 267.35,1009.11 267.744,1008.72 L276.716,999.777 C276.927,999.568 277.017,999.29 277.002,999.016 C277.017,998.741 276.927,998.464 276.716,998.254 L267.744,989.313 L267.744,989.313 Z"
                id="chevron-right-square"
              ></path>
            </g>
          </g>
        </svg>

      </button>
    </div>
  )
}

export default Team