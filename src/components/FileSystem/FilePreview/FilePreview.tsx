import { useEffect, useState } from "react";

type Props = {
  file?: File;
};

export default function FilePreview(props: Props) {
  const [text, setText] = useState("");

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
    <pre className="text-lg text-start overflow-y-auto overflow-x-none h-screen">
      {text}
    </pre>
  );
}
