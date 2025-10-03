// import React, { useEffect, useState } from "react";

// export default function StepThree({ formData, setFormData, errors }) {
//   const [files, setFiles] = useState(formData.certificates || []);

//   useEffect(() => {
//     // keep local files state in sync if parent updates externally
//     setFiles(formData.certificates || []);
//   }, [formData.certificates]);

//   const handleChange = (e) => {
//     const newFiles = Array.from(e.target.files || []);
//     const updated = [...files, ...newFiles];
//     setFiles(updated);
//     setFormData((prev) => ({ ...prev, certificates: updated }));
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-lg font-semibold">Certificates</h3>
//       <input type="file" multiple onChange={handleChange} />
//       {files.length > 0 && (
//         <ul className="list-disc pl-5 mt-2">
//           {files.map((f, i) => (
//             <li key={i}>{f.name}</li>
//           ))}
//         </ul>
//       )}
//       {errors.certificates && <p className="text-red-500 mt-1">{errors.certificates}</p>}
//     </div>
//   );
// }
