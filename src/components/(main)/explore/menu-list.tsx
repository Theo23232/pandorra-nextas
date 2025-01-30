"use client"

import Link from 'next/link';

export type MenuListProps = {}

export const MenuList = (props: MenuListProps) => {
  return (
    <ul className="menu-list mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <li id="tour2-step1">
        <Link
          className="text-f-text-secondary hover:text-f-text group relative flex h-full flex-col gap-x-1 rounded-xl bg-gradient-to-r from-[#3F0098] to-[#8933FF] p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-80 md:p-[18px]"
          href="/image-to-video"
          prefetch={true}
        >
          <div className="flex items-center justify-between">
            <span className="mb-3 inline-flex items-center justify-center">
              <span className="i-cus--pol-img-to-video inline-flex size-9 items-center justify-center text-white"></span>
            </span>
            <span className="i-com--right-arrow inline-flex size-6 items-center justify-center text-white transition-all group-hover:translate-x-1 md:block"></span>
          </div>
          <div className="whitespace-pre-wrap text-sm font-semibold text-white md:text-base">
            Image to Video
          </div>
        </Link>
      </li>
      <li id="tour2-step2">
        <Link
          className="text-f-text-secondary hover:text-f-text group relative flex h-full flex-col gap-x-1 rounded-xl bg-gradient-to-r from-[#007AD4] to-[#2EA4FF] p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-80 md:p-[18px]"
          href="/image/generation"
          prefetch={true}
        >
          <div className="flex items-center justify-between">
            <span className="mb-3 inline-flex items-center justify-center">
              <span className="i-cus--pol-consistent-character-video inline-flex size-9 items-center justify-center text-white"></span>
            </span>
            <span className="i-com--right-arrow inline-flex size-6 items-center justify-center text-white transition-all group-hover:translate-x-1 md:block"></span>
          </div>
          <div className="whitespace-pre-wrap text-sm font-semibold text-white md:text-base">
            Image generation
          </div>
        </Link>
      </li>
      <li id="tour2-step3">
        <Link
          className="text-f-text-secondary hover:text-f-text group relative flex h-full flex-col gap-x-1 rounded-xl bg-gradient-to-r from-[#F37300] to-[#F0AA00] p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-80 md:p-[18px]"
          href="/ai-video-generator"
          prefetch={true}
        >
          <div className="flex items-center justify-between">
            <span className="mb-3 inline-flex items-center justify-center">
              <span className="i-cus--pol-text-to-video inline-flex size-9 items-center justify-center text-white"></span>
            </span>
            <span className="i-com--right-arrow inline-flex size-6 items-center justify-center text-white transition-all group-hover:translate-x-1 md:block"></span>
          </div>
          <div className="whitespace-pre-wrap text-sm font-semibold text-white md:text-base">
            Text to Video
          </div>
        </Link>
      </li>
      <li id="tour2-step4">
        <Link
          className="text-f-text-secondary hover:text-f-text group relative flex h-full flex-col gap-x-1 rounded-xl bg-gradient-to-r from-[#D6141E] to-[#FF824C] p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-80 md:p-[18px]"
          href="/video-to-video"
          prefetch={true}
        >
          <div className="flex items-center justify-between">
            <span className="mb-3 inline-flex items-center justify-center">
              <span className="i-cus--pol-video-to-video inline-flex size-9 items-center justify-center text-white"></span>
            </span>
            <span className="i-com--right-arrow inline-flex size-6 items-center justify-center text-white transition-all group-hover:translate-x-1 md:block"></span>
          </div>
          <div className="whitespace-pre-wrap text-sm font-semibold text-white md:text-base">
            Video to Video
          </div>
        </Link>
      </li>
      <li id="tour2-step5">
        <Link
          className="text-f-text-secondary hover:text-f-text group relative flex h-full flex-col gap-x-1 rounded-xl bg-gradient-to-r from-[#018456] to-[#01c080] p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-80 md:p-[18px]"
          href="/ai-animation-generator"
          prefetch={true}
        >
          <div className="flex items-center justify-between">
            <span className="mb-3 inline-flex items-center justify-center">
              <span className="i-cus--pol-ai-animation-generator inline-flex size-9 items-center justify-center text-white"></span>
            </span>
            <span className="i-com--right-arrow inline-flex size-6 items-center justify-center text-white transition-all group-hover:translate-x-1 md:block"></span>
          </div>
          <div className="whitespace-pre-wrap text-sm font-semibold text-white md:text-base">
            AI assistant
          </div>
        </Link>
      </li>
    </ul>
  )
}
