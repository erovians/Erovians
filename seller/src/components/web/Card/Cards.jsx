import React from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const Cards = ({ image, step, title, description }) => {
  return (
    <> 
    <div className="w-full h-[350px] mx-auto w">
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border shadow-md bg-white"
      >
        {/* Left Image */}
        <ResizablePanel defaultSize={80}>
         <div className="flex items-center justify-center p-4 h-[100%]">
  <img 
    src={image} 
    alt={title} 
    className="w-full h-full object-cover rounded-md"
  />
</div>

        </ResizablePanel>

        <ResizableHandle />

        {/* Right Content */}
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            {/* Step */}
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-2">
                <p className="text-blue font-semibold text-xl">
                  {step}
                </p>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Title + Description */}
            <ResizablePanel defaultSize={75}>
              <div className="flex flex-col h-full items-center justify-center text-center p-4">
                <span className="font-bold text-lg sm:text-xl text-gray-600">
                  {title}
                </span>
                <span className="text-sm sm:text-base text-grey mt-2">
                  {description}
                </span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
    </>   
  )
}

export default Cards
