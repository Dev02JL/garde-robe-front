import fileList from "@/data/fileList.json";

export default function Test() {
  const files = fileList.map((clothe) => clothe.fileId);
  console.log(files);
  return (
    <div>
      {files.map((fileId) => (
        <div key={fileId}>{fileId}</div>
      ))}
    </div>
  );
}
