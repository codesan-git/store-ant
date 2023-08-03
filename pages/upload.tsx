import { File } from "buffer";
import React, {useState} from "react";

export default function Upload() {
  const { useState } = React;
  const [files, setFile] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const handleFile = (e: any) => {
    setMessage("");
    let file = e.target.files;

    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setFile([...files, file[i]]);
      } else {
        setMessage("only images accepted");
      }
      console.log("FILES: ", files);
    }
  };
  const removeImage = (i: string) => {
    setFile(files.filter((x) => x.name !== i));
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center bg-gray-300 px-2">
        <div className="p-3 md:w-1/2 w-[360px] bg-white rounded-md">
          <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">
            {message}
          </span>
          <div className="h-32 w-full relative border-2 items-center rounded-md cursor-pointer bg-gray-300 border-gray-400 border-dotted">
            <input
              type="file"
              onChange={handleFile}
              className="h-full w-full bg-green-200 opacity-0 z-10 absolute"
              multiple={true}
              name="files[]"
            />
            <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0">
              <div className="flex flex-col">
                <i className="mdi mdi-folder-open text-[30px] text-gray-400 text-center"></i>
                <span className="text-[12px]">{`Drag and Drop a file`}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, key) => {
              return (
                <div key={key} className="relative overflow-hidden">
                  <div
                    onClick={() => {
                      removeImage(file.name);
                    }}
                    className="right-1 hover:text-white cursor-pointer bg-red-400"
                  >Remove</div>
                  <img
                    className="h-20 w-20 rounded-md"
                    src={URL.createObjectURL(file)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
