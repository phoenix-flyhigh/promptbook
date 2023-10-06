import React from 'react'
import Image from "next/image"


interface ThemeChangeButtonViewProps {
  iconUrl: string,
  handleClick: () => void,
  iconSize: number
}

const ThemeChangeButtonView: (props: ThemeChangeButtonViewProps) => JSX.Element = ({
  iconUrl,
  iconSize,
  handleClick
}) => {
  return (
    <div className='mr-3 mt-[0.15rem]'>
      <Image
        data-testid="tid-theme-icon"
        src={iconUrl}
        alt="Theme change icon"
        width={iconSize}
        height={iconSize}
        className="rounded-full"
        onClick={handleClick}
      />
    </div>
  )
}

export default ThemeChangeButtonView