import { useEffect, useState } from "react";

type Props = {
  file?: File;
  fileHandle?: any;
};

export default function FilePreview(props: Props) {
  const [text, setText] = useState("");

  // file to txt
  useEffect(() => {
    async function getFileData() {
      // const arraybuffer = await file.arrayBuffer();
      // const blob = new Blob([arraybuffer], { type: props.file.name });
      const text = await props.file.text();
      return text;
    }
    getFileData().then((t: string) => {
      setText(t);
    });
  }, [props.file]);

  return (
    <pre
      contentEditable
      onInput={(e) => {
        const content = e.currentTarget.innerText;
        writeFile(props.fileHandle, content);
      }}
      className="text-lg text-start overflow-y-auto overflow-x-none h-screen"
    >
      {text}
    </pre>
  );
}

async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}
