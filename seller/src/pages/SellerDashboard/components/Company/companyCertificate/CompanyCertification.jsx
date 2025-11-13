import React, { useState, useEffect } from "react";
import { AlertDialogMenu } from "../../Helper/AlertDialogMenu";
import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { certificateSchema } from "../../../schema/certificate.schema";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  FileTextIcon,
  CheckCircleIcon,
  GlobeIcon,
  ReceiptIcon,
  FileText,
  Image,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/utils/axios.utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchCertificates } from "../../../../../redux/slice/certificatesSlice";
import { Spinner } from "@/components/ui/spinner";

export default function CertificateDialog() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [uploading, setUpoloading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleViewCertificate = (cert) => {
    setSelectedCertificate(cert);
    setViewOpen(true);
  };

  const handleDeleteCertificate = async () => {
    // const confirm = window.confirm("Are you sure you want to delete this certificate?");

    try {
      await api.delete(`/company/certificates/${selectedCertificate._id}`);

      dispatch(fetchCertificates());
      setViewOpen(false);
    } catch (error) {
      console.error("Failed to delete certificate:", error);
      alert("Error deleting certificate. Please try again.");
    }
  };

  const dispatch = useDispatch();
  const {
    items: certificates,
    loading,
    error,
  } = useSelector((state) => state.certificates);

  useEffect(() => {
    dispatch(fetchCertificates());
  }, [dispatch]);

  const [form, setForm] = useState({
    certificationName: "",
    legalOwner: "",
    issueDate: "",
    expiryDate: "",
    Description: "",
    sameAsRegistered: false,
    comments: "",
    file: null,
  });

  const openFor = (type) => {
    setSelectedType(type);
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // ✅ Handle checkbox
    if (type === "checkbox") {
      setForm((s) => ({ ...s, [name]: checked }));
      return;
    }

    // ✅ Handle file upload with size validation (300KB = 300 * 1024 bytes)
    if (files) {
      const file = files[0];
      if (file) {
        if (file.size > 300 * 1024) {
          setFormErrors((prev) => ({
            ...prev,
            file: "File size must be less than 300KB",
          }));
          return;
        }

        // If valid file size, set file & clear error
        setForm((s) => ({ ...s, file }));
        setFormErrors((prev) => ({ ...prev, file: "" }));
      }
      return;
    }

    // ✅ Handle normal inputs
    setForm((s) => ({ ...s, [name]: value }));

    // ✅ Validate issueDate < expiryDate
    if (name === "issueDate" || name === "expiryDate") {
      setFormErrors((prev) => {
        const issue = name === "issueDate" ? value : form.issueDate;
        const expiry = name === "expiryDate" ? value : form.expiryDate;

        if (issue && expiry && new Date(expiry) <= new Date(issue)) {
          return {
            ...prev,
            expiryDate: "Expiry date must be greater than issue date",
          };
        } else {
          return { ...prev, expiryDate: "" };
        }
      });
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Client-side validation with Zod
    const result = certificateSchema.safeParse(form);

    if (!result.success) {
      const errors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        errors[field] = err.message;
      });
      setFormErrors(errors);
      return; // ❌ Stop here if form has errors
    }

    // ✅ No validation errors → continue
    setFormErrors({});
    const validatedData = result.data;

    // 2️⃣ Prepare FormData only after validation passes
    const payload = new FormData();
    payload.append("type", selectedType);
    payload.append("certificationName", validatedData.certificationName);
    payload.append("legalOwner", validatedData.legalOwner);
    payload.append("issueDate", validatedData.issueDate);
    payload.append("expiryDate", validatedData.expiryDate || "");
    payload.append("Description", validatedData.Description);
    payload.append(
      "sameAsRegistered",
      validatedData.sameAsRegistered ? "1" : "0"
    );
    payload.append("comments", validatedData.comments || "");
    if (validatedData.file) payload.append("file", validatedData.file);

    console.log(payload);
    try {
      // ✅ Only set uploading now (after form is valid)
      setUpoloading(true);

      const res = await api.post("/company/upload", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Uploaded:", res.data);
      dispatch(fetchCertificates());
      setOpen(false);

      // Reset form after success
      setForm({
        certificationName: "",
        legalOwner: "",
        issueDate: "",
        expiryDate: "",
        Description: "",
        sameAsRegistered: false,
        comments: "",
        file: null,
      });
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUpoloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Button + Dropdown */}
      <div className="flex justify-end items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-[50px] w-fit text-white cursor-pointer bg-navyblue hover:border hover:border-navyblue"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Certificate
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => openFor("Business Registration")}
              >
                <FileTextIcon className="mr-2 h-4 w-4" />
                Business Registration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openFor("Tax Compliance")}>
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Tax Compliance
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => openFor("Import Export Code (IEC)")}
              >
                <GlobeIcon className="mr-2 h-4 w-4" />
                Import Export Code (IEC)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openFor("GST Certificate")}>
                <ReceiptIcon className="mr-2 h-4 w-4" />
                GST Certificate
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Certificate List */}
      <div className="mt-10 w-full">
        <h2 className="text-2xl font-semibold text-navyblue mb-6 border-b pb-2">
          Uploaded Certificates
        </h2>

        {loading ? (
          <div className="text-gray-600 text-center py-8">
            Loading certificates...
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-gray-500 italic text-center py-8">
            No certificates uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-navyblue/40 transition-all duration-200 p-5 flex flex-col"
              >
                {/* Header */}
                <div className="space-y-2 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {cert.certificationName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Owner:</span>{" "}
                    {cert.legalOwner}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-1 text-sm text-gray-600 flex-1">
                  <p>
                    <span className="font-medium text-gray-700">Issue:</span>{" "}
                    {cert.issueDate
                      ? new Date(cert.issueDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Expires:</span>{" "}
                    {cert.expiryDate
                      ? new Date(cert.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-gray-600 line-clamp-2">
                    <span className="font-medium text-gray-700">
                      Description:
                    </span>{" "}
                    {cert.Description || "No description provided."}
                  </p>
                </div>

                {/* Footer / Actions */}
                <div className="mt-4 flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-gray-100">
                  {cert.fileUrl && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {cert.fileUrl.endsWith(".pdf") ? (
                        <span className=" text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">
                          <FileText />
                        </span>
                      ) : (
                        <span className=" text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                          <Image />
                        </span>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => handleViewCertificate(cert)}
                    className="px-4 py-1.5 text-sm font-medium border-navyblue text-navyblue rounded-lg hover:bg-navyblue hover:text-white transition-colors w-full sm:w-auto"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Upload: {selectedType || "Certificate"}</DialogTitle>
            <DialogDescription>
              Fill certificate details and upload the document.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex-1 overflow-y-auto pr-2"
          >
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Certificate Details</FieldLegend>
                <FieldDescription>
                  Provide the certification details below.
                </FieldDescription>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="certificationName">
                      Name of Certification
                    </FieldLabel>
                    <Input
                      id="certificationName"
                      name="certificationName"
                      placeholder="e.g. MSME Registration"
                      className="placeholder:text-xs"
                      value={form.certificationName}
                      onChange={handleChange}
                    />
                    {formErrors.certificationName && (
                      <p className="text-red-500 text-xs -mt-1.5">
                        {formErrors.certificationName}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="legalOwner">
                      Legal Owner Name
                    </FieldLabel>
                    <p className="text-gray-500 text-xs mt-1">
                      Name exactly as on the legal document.
                    </p>

                    <Input
                      id="legalOwner"
                      name="legalOwner"
                      placeholder="Registered entity / owner's name"
                      value={form.legalOwner}
                      className="placeholder:text-xs"
                      onChange={handleChange}
                    />

                    {formErrors.legalOwner && (
                      <p className="text-red-500 text-xs -mt-1.5">
                        {formErrors.legalOwner}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="Description">
                      Certificate Description
                    </FieldLabel>

                    <textarea
                      id="Description"
                      className="placeholder:text-xs border-1 p-2"
                      name="Description"
                      rows={4}
                      cols={40}
                      placeholder="Certificate Description"
                      value={form.Description}
                      onChange={handleChange}
                    />
                    {formErrors.Description && (
                      <p className="text-red-500 text-xs -mt-1.5">
                        {formErrors.Description}
                      </p>
                    )}
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                    <Field>
                      <FieldLabel htmlFor="issueDate">Issue Date</FieldLabel>
                      <Input
                        id="issueDate"
                        name="issueDate"
                        type="date"
                        className="text-xs"
                        value={form.issueDate}
                        onChange={handleChange}
                      />
                      {formErrors.issueDate && (
                        <p className="text-red-500 text-xs -mt-1.5">
                          {formErrors.issueDate}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="expiryDate">Expiry Date</FieldLabel>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        className="text-xs"
                        min={form.issueDate || ""}
                        value={form.expiryDate}
                        onChange={handleChange}
                      />
                      {formErrors.expiryDate && (
                        <p className="text-red-500 text-xs -mt-1.5">
                          {formErrors.expiryDate}
                        </p>
                      )}
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Upload Certificate</FieldLabel>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center w-[45%] gap-2 border border-gray-300 p-3  rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-navyblue">
                        <ImageUp className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-500 text-sm">
                          Upload Cetificate
                        </span>
                        <input
                          type="file"
                          id="file"
                          name="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleChange}
                          className="hidden"
                        />
                        {form.file && (
                          <div className="text-sm truncate max-w-xs ">
                            {form.file.name}
                          </div>
                        )}
                      </label>
                    </div>
                    <p className="text-gray-500 text-xs ">
                      {" "}
                      Accepted: PDF, JPG, PNG. Max size: (validate on server).
                    </p>

                    {formErrors.file && (
                      <p className="text-red-500 text-xs -mt-1.5">
                        {formErrors.file}
                      </p>
                    )}
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field
                orientation="horizontal"
                className="justify-end gap-2 mt-4"
              >
                <Button type="submit" disabled={uploading}>
                  {uploading && <Spinner />}
                  {uploading ? "Uploading..." : "Upload Certificate"}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <DialogFooter />
        </DialogContent>
      </Dialog>

      {/* Dialog box for company details */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent
          className="sm:max-w-full w-full h-full  shadow-lg p-6 bg-gradient-to-b from-white to-gray-50 
               overflow-y-auto  sm:rounded-xl"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 border-b pb-2">
              Certificate Details
            </DialogTitle>
          </DialogHeader>

          {selectedCertificate && (
            <div className="mt-4 space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Certification Name
                  </p>
                  <p className="font-medium">
                    {selectedCertificate.certificationName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">Legal Owner</p>
                  <p className="font-medium">
                    {selectedCertificate.legalOwner}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 uppercase">Description</p>
                  <p className="font-medium">
                    {selectedCertificate.Description || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">Issue Date</p>
                  <p className="font-medium">
                    {selectedCertificate.issueDate
                      ? new Date(
                          selectedCertificate.issueDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">Expiry Date</p>
                  <p className="font-medium">
                    {selectedCertificate.expiryDate
                      ? new Date(
                          selectedCertificate.expiryDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {selectedCertificate.fileUrl && (
                <div className="mt-6">
                  <p className="text-xs text-gray-500 uppercase mb-2">
                    Uploaded Certificate
                  </p>

                  <div className="border w-full sm:w-[70%] rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                    {selectedCertificate.fileUrl.endsWith(".pdf") ? (
                      <iframe
                        src={selectedCertificate.fileUrl}
                        title="PDF Preview"
                        className="w-full h-96"
                      />
                    ) : (
                      <img
                        src={selectedCertificate.fileUrl}
                        alt="Certificate"
                        className="w-full h-auto max-h-[400px] object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
                        onClick={() =>
                          setZoomedImage(selectedCertificate.fileUrl)
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => setViewOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              className="rounded-lg shadow hover:shadow-md"
              onClick={() => setOpenDeleteDialog(true)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="sm:max-w-4xl p-4  rounded-lg">
          <div className="flex justify-center items-center">
            <img
              src={zoomedImage}
              alt="Zoomed Certificate"
              className="max-h-[80vh] object-contain"
            />
          </div>
          <DialogFooter className="flex justify-center pt-4 border-navyblue">
            <Button variant="outline" onClick={() => setZoomedImage(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*  alert dilog is here */}
      <AlertDialogMenu
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title="Delete Certificate"
        description="Are you sure you want to delete this certificate? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          setOpenDeleteDialog(false), handleDeleteCertificate();
        }}
      />
    </div>
  );
}
