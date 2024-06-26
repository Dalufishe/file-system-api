import { useCallback, useState } from "react";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import formatBytes from "../../../utils/formatBytes";
import {
  LuScroll,
  LuFolder,
  LuFolderOpen,
  LuImage,
  LuFile,
  LuFileText,
} from "react-icons/lu";

const Dir = ({ name, item, fileOnClick, folderOnClick }) => {

  const [open, setOpen] = useState(false);

  const distinguishFileType = useCallback((name: string, type: string) => {
    const spl = type.split("/")[0];
    // image
    if (spl === "image") {
      return (
        <>
          <LuImage color="lightgreen" />
          {name}
        </>
      );
    }
    // text / js files
    else if (spl === "text" || spl === "application") {
      return (
        <>
          <LuFileText />
          {name}
        </>
      );
    }
    // don't know wtf
    else {
      return (
        <>
          <LuFile />
          {name}
        </>
      );
    }
  }, []);

  return (
    <li className="pl-4">
      {item?.file && item?.file instanceof File ? (
        // file
        <span
          onClick={async () => {
            fileOnClick && fileOnClick(item);
          }}
          className="flex items-center pl-4 hover:underline"
          title={"file | " + formatBytes(item.file.size)}
        >
          <div className="flex items-center gap-2">
            {distinguishFileType(name, item.file.type)}
          </div>
        </span>
      ) : (
        // folder
        <span
          onClick={() => {
            setOpen(!open);
            folderOnClick && folderOnClick(item);
          }}
          className="flex items-center gap-1 hover:underline"
          title="segment"
        >
          {open ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}
          {name.match(/202[34]\d+/gu) ? (
            <div className="flex items-center gap-2">
              <LuScroll className="text-orange-500" />
              {name}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {open ? (
                <LuFolderOpen className="text-yellow-400" />
              ) : (
                <LuFolder className="text-yellow-400" />
              )}
              {name}
            </div>
          )}
        </span>
      )}
      {item instanceof Object && open && (
        <FileTree
          data={item}
          fileOnClick={fileOnClick}
          folderOnClick={folderOnClick}
        />
      )}
    </li>
  );
};

const FileTree = ({ data, fileOnClick, folderOnClick }) => {
  return (
    <ul className="text-sm cursor-pointer">
      {Object.entries(data).map(([name, item]) => (
        <Dir
          key={name}
          name={name}
          item={item}
          fileOnClick={fileOnClick}
          folderOnClick={folderOnClick}
        />
      ))}
    </ul>
  );
};

export default FileTree;
