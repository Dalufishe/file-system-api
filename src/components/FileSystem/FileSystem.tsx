import { useEffect, useState } from "react";
import readDirectory from "../../utils/readDirectory";
import FileTree from "./FileTree/FileTree";
import FilePreview from "./FilePreview/FilePreview";
import sleep from "../../utils/sleep";

export default function FileSystem() {
  const [dir, setDir] = useState({});
  const [file, setFile] = useState<{
    file: File;
    fileHandle: FileSystemFileHandle;
  }>();
  const [directoryHandle, setDirectoryHandle] = useState();

  useEffect(() => {
    async function loadDirectory() {
      const directoryHandle = await getSavedDirectoryHandle();
      for await (const entry of directoryHandle.values()) {
      }
      setDirectoryHandle(directoryHandle);
      if (directoryHandle) {
        const dir = await readDirectory(directoryHandle);
        setDir(dir);
      }
    }
    loadDirectory();
  }, []);

  const handleOpenDirectory = async () => {
    const directoryHandle = await getDirectoryHandle();
    setDirectoryHandle(directoryHandle);
    const dir = await readDirectory(directoryHandle);
    setDir(dir);
  };

  const handleFileOnClick = async (fileObject: {
    file: File;
    fileHandle: FileSystemFileHandle;
  }) => {
    console.log(fileObject);
    setFile(fileObject);
    // const arraybuffer = await file.arrayBuffer();
    // const blob = new Blob([arraybuffer], { type: file.name });
    // const text = await file.text();
    // PubSub.publish("onFileSelect", {
    //   id: nanoid(),
    //   fileType: file.type,
    //   fileName: file.name,
    //   blob,
    //   text,
    // });
  };
  const handleFolderOnClick = async () => {};

  return (
    <div className="flex gap-12 py-4">
      <div className="flex flex-col gap-4">
        <OpenFolderButton onClick={handleOpenDirectory} />
        <div className="flex gap-2 w-60 text-lg bg-[#111] opacity-80 py-2 pr-4 overflow-hidden border-4 transition-[border]">
          <FileTree
            data={dir}
            fileOnClick={handleFileOnClick}
            folderOnClick={handleFolderOnClick}
          />
        </div>
      </div>
      <FilePreview file={file?.file} fileHandle={file?.fileHandle} />
    </div>
  );
}

function OpenFolderButton(props: { onClick: () => void }) {
  return (
    <button
      onClick={props.onClick}
      className="text-lg bg-[#333] opacity-80 hover:opacity-100 py-2 px-4 h-fit"
    >
      Open Folder
    </button>
  );
}

async function getDirectoryHandle() {
  const options = { mode: "readwrite" };
  const directoryHandle = await window.showDirectoryPicker(options);
  await saveDirectoryHandle(directoryHandle);
  return directoryHandle;
}

async function saveDirectoryHandle(directoryHandle) {
  const db = await openDB();
  const transaction = db.transaction("directoryHandles", "readwrite");
  const store = transaction.objectStore("directoryHandles");
  await store.put(directoryHandle, "directoryHandle");
  await transaction.complete;
}

async function getSavedDirectoryHandle() {
  const db = await openDB();
  const transaction = db.transaction("directoryHandles", "readonly");
  const store = transaction.objectStore("directoryHandles");
  const directoryHandleRequest = await store.get("directoryHandle");
  await sleep(500);
  return directoryHandleRequest.result;
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("fileSystemDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("directoryHandles");
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject("Error opening database:", event.target.errorCode);
    };
  });
}

// async function verifyPermission(fileHandle, readWrite) {
//   const options = {};
//   if (readWrite) {
//     options.mode = "readwrite";
//   }
//   // Check if permission was already granted. If so, return true.
//   if ((await fileHandle.queryPermission(options)) === "granted") {
//     return true;
//   }
//   // Request permission. If the user grants permission, return true.
//   if ((await fileHandle.requestPermission(options)) === "granted") {
//     return true;
//   }
//   // The user didn't grant permission, so return false.
//   return false;
// }
