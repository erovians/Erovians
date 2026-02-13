

// // // import { useEffect, useState } from "react";
// // // import api from "../services/api.js";
// // // import "./Requests.css";

// // // const Requests = () => {
// // //   const [data, setData] = useState({
// // //     individualSellers: [],
// // //     professionalSellers: [],
// // //   });
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [selectedCompany, setSelectedCompany] = useState(null);
// // //   const [verifiedFields, setVerifiedFields] = useState({});
// // //   const [rejectReason, setRejectReason] = useState("");
// // //   const [actionLoading, setActionLoading] = useState(false);

// // //   useEffect(() => {
// // //     fetchRequests();
// // //   }, []);

// // //   const fetchRequests = async () => {
// // //     try {
// // //       const res = await api.get("/admin/requests/pending");
// // //       console.log("✅ API Response:", res.data);
// // //       setData(res.data.data || { individualSellers: [], professionalSellers: [] });
// // //     } catch (err) {
// // //       setError("Failed to load requests");
// // //       console.error("❌ Fetch error:", err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ✅ FIX: Get correct seller ID
// // //   const getSellerId = (seller) => {
// // //     // Try different possible ID fields
// // //     return seller?._id || seller?.id || null;
// // //   };

// // //   // ✅ HANDLE INDIVIDUAL SELLER APPROVE
// // //   const handleApproveIndividual = async (seller) => {
// // //     const sellerId = getSellerId(seller);
// // //     console.log("🔍 Approving seller:", { seller, sellerId });
    
// // //     if (!sellerId) {
// // //       alert("❌ Error: Seller ID not found");
// // //       return;
// // //     }
    
// // //     if (!window.confirm(`Approve ${seller.seller_name}?`)) return;
    
// // //     setActionLoading(true);
// // //     try {
// // //       await api.patch(`/admin/seller/${sellerId}/approve`);
// // //       alert("✅ Seller approved! Email sent.");
// // //       fetchRequests();
// // //     } catch (err) {
// // //       console.error("❌ Approve error:", err);
// // //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// // //     } finally {
// // //       setActionLoading(false);
// // //     }
// // //   };

// // //   // ✅ HANDLE INDIVIDUAL SELLER REJECT
// // //   const handleRejectIndividual = async (seller) => {
// // //     const sellerId = getSellerId(seller);
// // //     if (!sellerId) {
// // //       alert("❌ Error: Seller ID not found");
// // //       return;
// // //     }
    
// // //     const reason = prompt("Enter rejection reason:");
// // //     if (!reason) return;
    
// // //     setActionLoading(true);
// // //     try {
// // //       await api.patch(`/admin/seller/${sellerId}/reject`, { reason });
// // //       alert("❌ Seller rejected! Email sent.");
// // //       fetchRequests();
// // //     } catch (err) {
// // //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// // //     } finally {
// // //       setActionLoading(false);
// // //     }
// // //   };

// // //   // ✅ HANDLE INDIVIDUAL SELLER SUSPEND
// // //   const handleSuspendIndividual = async (seller) => {
// // //     const sellerId = getSellerId(seller);
// // //     if (!sellerId) {
// // //       alert("❌ Error: Seller ID not found");
// // //       return;
// // //     }
    
// // //     const reason = prompt("Enter suspension reason:");
// // //     if (!reason) return;
    
// // //     setActionLoading(true);
// // //     try {
// // //       await api.patch(`/admin/seller/${sellerId}/suspend`, { reason });
// // //       alert("⚠️ Seller suspended! Email sent.");
// // //       fetchRequests();
// // //     } catch (err) {
// // //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// // //     } finally {
// // //       setActionLoading(false);
// // //     }
// // //   };

// // //   // ✅ OPEN COMPANY VERIFICATION MODAL
// // //   const openCompanyModal = (item) => {
// // //     console.log("🔍 Opening company modal:", item);
// // //     setSelectedCompany(item);
// // //     setVerifiedFields({});
// // //     setRejectReason("");
// // //   };

// // //   // ✅ TOGGLE INDIVIDUAL FIELD
// // //   const toggleField = (fieldName) => {
// // //     setVerifiedFields((prev) => ({
// // //       ...prev,
// // //       [fieldName]: !prev[fieldName],
// // //     }));
// // //   };

// // //   // ✅ SELECT ALL FIELDS
// // //   const selectAllFields = () => {
// // //     const allFields = getAllCompanyFields(selectedCompany?.company);
// // //     const allChecked = {};
// // //     allFields.forEach((f) => (allChecked[f.label] = true));
// // //     setVerifiedFields(allChecked);
// // //   };

// // //   // ✅ DESELECT ALL FIELDS
// // //   const deselectAllFields = () => {
// // //     setVerifiedFields({});
// // //   };

// // //   // ✅ GET ALL COMPANY FIELDS
// // //   const getAllCompanyFields = (company) => {
// // //     if (!company) return [];

// // //     const fields = [];

// // //     // Company Basic Info
// // //     if (company.companyBasicInfo) {
// // //       const basic = company.companyBasicInfo;
// // //       if (basic.companyName) fields.push({ label: "Company Name", value: basic.companyName, section: "Basic Info" });
// // //       if (basic.company_registration_number) fields.push({ label: "Registration Number", value: basic.company_registration_number, section: "Basic Info" });
// // //       if (basic.locationOfRegistration) fields.push({ label: "Location of Registration", value: basic.locationOfRegistration, section: "Basic Info" });
// // //       if (basic.businessType) fields.push({ label: "Business Type", value: basic.businessType, section: "Basic Info" });
// // //       if (basic.taxType) fields.push({ label: "Tax Type", value: basic.taxType, section: "Basic Info" });
// // //       if (basic.companyEmail) fields.push({ label: "Company Email", value: basic.companyEmail, section: "Basic Info" });
// // //       if (basic.companyPhoneNumber) fields.push({ label: "Phone Number", value: basic.companyPhoneNumber, section: "Basic Info" });
// // //       if (basic.companyWebsite) fields.push({ label: "Website", value: basic.companyWebsite, section: "Basic Info" });
// // //       if (basic.yearEstablished) fields.push({ label: "Year Established", value: basic.yearEstablished, section: "Basic Info" });
// // //       if (basic.numberOfEmployees) fields.push({ label: "Number of Employees", value: basic.numberOfEmployees, section: "Basic Info" });
// // //     }

// // //     // Company Address
// // //     if (company.companyAddress) {
// // //       const addr = company.companyAddress;
// // //       if (addr.street) fields.push({ label: "Street Address", value: addr.street, section: "Address" });
// // //       if (addr.city) fields.push({ label: "City", value: addr.city, section: "Address" });
// // //       if (addr.postalCode) fields.push({ label: "Postal Code", value: addr.postalCode, section: "Address" });
// // //       if (addr.state) fields.push({ label: "State/Province", value: addr.state, section: "Address" });
// // //       if (addr.country) fields.push({ label: "Country", value: addr.country, section: "Address" });
// // //     }

// // //     // Legal Info
// // //     if (company.legalInfo) {
// // //       const legal = company.legalInfo;
// // //       if (legal.legalName) fields.push({ label: "Legal Name", value: legal.legalName, section: "Legal Info" });
// // //       if (legal.vatNumber) fields.push({ label: "VAT Number", value: legal.vatNumber, section: "Legal Info" });
// // //       if (legal.taxId) fields.push({ label: "Tax ID", value: legal.taxId, section: "Legal Info" });
// // //       if (legal.registrationCertificateUrl) fields.push({ label: "Registration Certificate", value: "📄 Uploaded", section: "Legal Info" });
// // //       if (legal.taxCertificateUrl) fields.push({ label: "Tax Certificate", value: "📄 Uploaded", section: "Legal Info" });
// // //       if (legal.businessLicenseUrl) fields.push({ label: "Business License", value: "📄 Uploaded", section: "Legal Info" });
// // //     }

// // //     // Bank Info
// // //     if (company.bankInfo) {
// // //       const bank = company.bankInfo;
// // //       if (bank.bankName) fields.push({ label: "Bank Name", value: bank.bankName, section: "Bank Info" });
// // //       if (bank.accountNumber) fields.push({ label: "Account Number", value: "****" + bank.accountNumber.substring(bank.accountNumber.length - 4), section: "Bank Info" });
// // //       if (bank.accountHolderName) fields.push({ label: "Account Holder", value: bank.accountHolderName, section: "Bank Info" });
// // //       if (bank.bankBranch) fields.push({ label: "Bank Branch", value: bank.bankBranch, section: "Bank Info" });
// // //       if (bank.swiftCode) fields.push({ label: "SWIFT Code", value: bank.swiftCode, section: "Bank Info" });
// // //       if (bank.currency) fields.push({ label: "Currency", value: bank.currency, section: "Bank Info" });
// // //     }

// // //     // Representative Info
// // //     if (company.representativeInfo) {
// // //       const rep = company.representativeInfo;
// // //       if (rep.fullName) fields.push({ label: "Representative Name", value: rep.fullName, section: "Representative" });
// // //       if (rep.position) fields.push({ label: "Position", value: rep.position, section: "Representative" });
// // //       if (rep.email) fields.push({ label: "Representative Email", value: rep.email, section: "Representative" });
// // //       if (rep.phoneNumber) fields.push({ label: "Representative Phone", value: rep.phoneNumber, section: "Representative" });
// // //       if (rep.idDocumentType) fields.push({ label: "ID Document Type", value: rep.idDocumentType, section: "Representative" });
// // //       if (rep.idDocumentNumber) fields.push({ label: "ID Number", value: rep.idDocumentNumber, section: "Representative" });
// // //       if (rep.idDocumentUrl) fields.push({ label: "ID Document", value: "📄 Uploaded", section: "Representative" });
// // //     }

// // //     // Billing Info
// // //     if (company.billingInfo) {
// // //       const bill = company.billingInfo;
// // //       if (bill.billingAddress) fields.push({ label: "Billing Address", value: bill.billingAddress, section: "Billing" });
// // //       if (bill.billingEmail) fields.push({ label: "Billing Email", value: bill.billingEmail, section: "Billing" });
// // //       if (bill.paymentTerms) fields.push({ label: "Payment Terms", value: bill.paymentTerms, section: "Billing" });
// // //     }

// // //     // Additional Info
// // //     if (company.additionalInfo) {
// // //       const add = company.additionalInfo;
// // //       if (add.description) fields.push({ label: "Company Description", value: add.description, section: "Additional" });
// // //       if (add.logoUrl) fields.push({ label: "Company Logo", value: "🖼️ Uploaded", section: "Additional" });
// // //       if (add.categoriesOfProducts && add.categoriesOfProducts.length > 0) {
// // //         fields.push({ label: "Product Categories", value: add.categoriesOfProducts.join(", "), section: "Additional" });
// // //       }
// // //       if (add.shippingCapabilities) fields.push({ label: "Shipping Capabilities", value: add.shippingCapabilities, section: "Additional" });
// // //       if (add.returnPolicy) fields.push({ label: "Return Policy", value: add.returnPolicy, section: "Additional" });
// // //     }

// // //     return fields;
// // //   };

// // //   // ✅ COUNT VERIFIED FIELDS
// // //   const getVerifiedCount = () => {
// // //     return Object.values(verifiedFields).filter(Boolean).length;
// // //   };

// // //   // ✅ CHECK IF ALL VERIFIED
// // //   const isAllVerified = () => {
// // //     const allFields = getAllCompanyFields(selectedCompany?.company);
// // //     return allFields.length > 0 && allFields.every((f) => verifiedFields[f.label]);
// // //   };

// // //   // ✅ APPROVE COMPANY
// // //   const handleApproveCompany = async () => {
// // //     if (!isAllVerified()) {
// // //       alert("⚠️ Please verify all fields before approving!");
// // //       return;
// // //     }
// // //     if (!window.confirm("✅ Approve this company?")) return;

// // //     setActionLoading(true);
// // //     try {
// // //       const companyId = selectedCompany.company._id || selectedCompany.company.id;
// // //       const allFields = getAllCompanyFields(selectedCompany.company);
// // //       await api.patch(`/admin/company/${companyId}/approve`, {
// // //         verifiedFields: allFields.map(f => f.label),
// // //       });
// // //       alert("✅ Company approved! Email sent to seller.");
// // //       setSelectedCompany(null);
// // //       fetchRequests();
// // //     } catch (err) {
// // //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// // //     } finally {
// // //       setActionLoading(false);
// // //     }
// // //   };

// // //   // ✅ REJECT COMPANY
// // //   const handleRejectCompany = async () => {
// // //     const unverifiedFields = getAllCompanyFields(selectedCompany.company)
// // //       .filter((f) => !verifiedFields[f.label])
// // //       .map((f) => f.label);

// // //     if (unverifiedFields.length === 0) {
// // //       alert("✅ All fields are verified. Use Approve instead!");
// // //       return;
// // //     }

// // //     const message = rejectReason || "Please correct the following fields";
// // //     if (!window.confirm(`❌ Reject and send corrections for ${unverifiedFields.length} fields?`)) return;

// // //     setActionLoading(true);
// // //     try {
// // //       const companyId = selectedCompany.company._id || selectedCompany.company.id;
// // //       await api.patch(`/admin/company/${companyId}/reject`, {
// // //         invalidFields: unverifiedFields,
// // //         message,
// // //       });
// // //       alert("❌ Company rejected! Email sent with correction details.");
// // //       setSelectedCompany(null);
// // //       fetchRequests();
// // //     } catch (err) {
// // //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// // //     } finally {
// // //       setActionLoading(false);
// // //     }
// // //   };

// // //   // Group fields by section
// // //   const getFieldsBySection = () => {
// // //     const allFields = getAllCompanyFields(selectedCompany?.company);
// // //     const sections = {};
// // //     allFields.forEach(field => {
// // //       if (!sections[field.section]) {
// // //         sections[field.section] = [];
// // //       }
// // //       sections[field.section].push(field);
// // //     });
// // //     return sections;
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="requests-page">
// // //         <div className="loading-container">
// // //           <div className="spinner"></div>
// // //           <p>Loading verification requests...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="requests-page">
// // //         <div className="error-container">
// // //           <div className="error-icon">⚠️</div>
// // //           <h2>Oops! Something went wrong</h2>
// // //           <p>{error}</p>
// // //           <button className="btn-retry" onClick={fetchRequests}>Try Again</button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="requests-page">
// // //       <div className="page-header">
// // //         <div className="header-content">
// // //           <h1>📋 Verification Requests</h1>
// // //           <p className="subtitle">Review and approve pending seller applications</p>
// // //         </div>
// // //         <div className="stats">
// // //           <div className="stat-card">
// // //             <div className="stat-value">{data.individualSellers.length}</div>
// // //             <div className="stat-label">Individual</div>
// // //           </div>
// // //           <div className="stat-card">
// // //             <div className="stat-value">{data.professionalSellers.length}</div>
// // //             <div className="stat-label">Professional</div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* INDIVIDUAL SELLERS */}
// // //       <section className="section-modern">
// // //         <div className="section-header">
// // //           <div className="section-title">
// // //             <div className="icon-wrapper individual">
// // //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
// // //                 <circle cx="12" cy="7" r="4"></circle>
// // //               </svg>
// // //             </div>
// // //             <div>
// // //               <h2>Individual Sellers</h2>
// // //               <p>{data.individualSellers.length} pending applications</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {data.individualSellers.length === 0 ? (
// // //           <div className="empty-state">
// // //             <div className="empty-icon">📭</div>
// // //             <h3>No pending individual sellers</h3>
// // //             <p>All individual seller applications have been processed</p>
// // //           </div>
// // //         ) : (
// // //           <div className="cards-grid-modern">
// // //             {data.individualSellers.map((seller) => (
// // //               <div key={seller._id || seller.id} className="seller-card individual-card">
// // //                 <div className="card-badge">Pending Review</div>
// // //                 <div className="seller-avatar">
// // //                   {seller.seller_name?.charAt(0).toUpperCase() || "S"}
// // //                 </div>
// // //                 <div className="seller-info">
// // //                   <h3>{seller.seller_name || "Unknown Seller"}</h3>
// // //                   <div className="info-row">
// // //                     <span className="label">Email:</span>
// // //                     <span className="value">{seller.seller_email || "N/A"}</span>
// // //                   </div>
// // //                   <div className="info-row">
// // //                     <span className="label">Country:</span>
// // //                     <span className="value">{seller.seller_country || "N/A"}</span>
// // //                   </div>
// // //                   <div className="info-row">
// // //                     <span className="label">Address:</span>
// // //                     <span className="value">{seller.seller_address || "N/A"}</span>
// // //                   </div>
// // //                 </div>
// // //                 <div className="card-actions-modern">
// // //                   <button 
// // //                     className="btn-modern btn-approve" 
// // //                     onClick={() => handleApproveIndividual(seller)}
// // //                     disabled={actionLoading}
// // //                   >
// // //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                       <polyline points="20 6 9 17 4 12"></polyline>
// // //                     </svg>
// // //                     Approve
// // //                   </button>
// // //                   <button 
// // //                     className="btn-modern btn-reject" 
// // //                     onClick={() => handleRejectIndividual(seller)}
// // //                     disabled={actionLoading}
// // //                   >
// // //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                       <line x1="18" y1="6" x2="6" y2="18"></line>
// // //                       <line x1="6" y1="6" x2="18" y2="18"></line>
// // //                     </svg>
// // //                     Reject
// // //                   </button>
// // //                   <button 
// // //                     className="btn-modern btn-suspend" 
// // //                     onClick={() => handleSuspendIndividual(seller)}
// // //                     disabled={actionLoading}
// // //                   >
// // //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                       <circle cx="12" cy="12" r="10"></circle>
// // //                       <line x1="15" y1="9" x2="9" y2="15"></line>
// // //                       <line x1="9" y1="9" x2="15" y2="15"></line>
// // //                     </svg>
// // //                     Suspend
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </section>

// // //       {/* PROFESSIONAL SELLERS WITH COMPANIES */}
// // //       <section className="section-modern">
// // //         <div className="section-header">
// // //           <div className="section-title">
// // //             <div className="icon-wrapper professional">
// // //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
// // //                 <polyline points="9 22 9 12 15 12 15 22"></polyline>
// // //               </svg>
// // //             </div>
// // //             <div>
// // //               <h2>Professional Sellers & Companies</h2>
// // //               <p>{data.professionalSellers.length} pending applications</p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {data.professionalSellers.length === 0 ? (
// // //           <div className="empty-state">
// // //             <div className="empty-icon">🏢</div>
// // //             <h3>No pending professional sellers</h3>
// // //             <p>All company applications have been processed</p>
// // //           </div>
// // //         ) : (
// // //           <div className="cards-grid-modern">
// // //             {data.professionalSellers.map((item) => (
// // //               <div key={item.seller?._id || item.seller?.id} className="seller-card professional-card">
// // //                 <div className="card-badge professional-badge">Professional</div>
// // //                 <div className="company-header">
// // //                   <div className="company-logo">
// // //                     {item.company?.companyBasicInfo?.companyName?.charAt(0).toUpperCase() || "C"}
// // //                   </div>
// // //                   <div>
// // //                     <h3>{item.company?.companyBasicInfo?.companyName || "Company Name Missing"}</h3>
// // //                     <p className="seller-tag">by {item.seller?.seller_name || "Unknown"}</p>
// // //                   </div>
// // //                 </div>
// // //                 <div className="company-details">
// // //                   <div className="detail-item">
// // //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
// // //                       <circle cx="12" cy="7" r="4"></circle>
// // //                     </svg>
// // //                     <span>{item.seller?.seller_name || "N/A"}</span>
// // //                   </div>
// // //                   <div className="detail-item">
// // //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                       <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
// // //                       <polyline points="22,6 12,13 2,6"></polyline>
// // //                     </svg>
// // //                     <span>{item.seller?.seller_email || "N/A"}</span>
// // //                   </div>
// // //                   <div className="detail-item">
// // //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
// // //                       <circle cx="12" cy="10" r="3"></circle>
// // //                     </svg>
// // //                     <span>{item.company?.companyBasicInfo?.locationOfRegistration || "N/A"}</span>
// // //                   </div>
// // //                   <div className="detail-item">
// // //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
// // //                       <polyline points="14 2 14 8 20 8"></polyline>
// // //                     </svg>
// // //                     <span>Reg: {item.company?.companyBasicInfo?.company_registration_number || "N/A"}</span>
// // //                   </div>
// // //                 </div>
// // //                 <button 
// // //                   className="btn-verify-company" 
// // //                   onClick={() => openCompanyModal(item)}
// // //                 >
// // //                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                     <path d="M9 11l3 3L22 4"></path>
// // //                     <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
// // //                   </svg>
// // //                   Verify Company Details
// // //                 </button>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </section>

// // //       {/* COMPANY VERIFICATION MODAL */}
// // //       {selectedCompany && (
// // //         <div className="modal-backdrop" onClick={() => setSelectedCompany(null)}>
// // //           <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
// // //             <div className="modal-header-modern">
// // //               <div className="modal-title-section">
// // //                 <h2>🔍 Company Verification</h2>
// // //                 <p>{selectedCompany.company?.companyBasicInfo?.companyName}</p>
// // //               </div>
// // //               <button className="btn-close-modern" onClick={() => setSelectedCompany(null)}>
// // //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                   <line x1="18" y1="6" x2="6" y2="18"></line>
// // //                   <line x1="6" y1="6" x2="18" y2="18"></line>
// // //                 </svg>
// // //               </button>
// // //             </div>

// // //             <div className="modal-toolbar">
// // //               <div className="toolbar-left">
// // //                 <button className="btn-tool" onClick={selectAllFields}>
// // //                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                     <polyline points="20 6 9 17 4 12"></polyline>
// // //                   </svg>
// // //                   Select All
// // //                 </button>
// // //                 <button className="btn-tool" onClick={deselectAllFields}>
// // //                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
// // //                   </svg>
// // //                   Clear All
// // //                 </button>
// // //               </div>
// // //               <div className="progress-indicator">
// // //                 <div className="progress-circle">
// // //                   <svg width="40" height="40">
// // //                     <circle cx="20" cy="20" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4"/>
// // //                     <circle 
// // //                       cx="20" 
// // //                       cy="20" 
// // //                       r="18" 
// // //                       fill="none" 
// // //                       stroke="#10b981" 
// // //                       strokeWidth="4"
// // //                       strokeDasharray={`${2 * Math.PI * 18}`}
// // //                       strokeDashoffset={`${2 * Math.PI * 18 * (1 - getVerifiedCount() / getAllCompanyFields(selectedCompany.company).length)}`}
// // //                       transform="rotate(-90 20 20)"
// // //                     />
// // //                   </svg>
// // //                   <span className="progress-text">{getVerifiedCount()}/{getAllCompanyFields(selectedCompany.company).length}</span>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             <div className="modal-body-modern">
// // //               {Object.entries(getFieldsBySection()).map(([section, fields]) => (
// // //                 <div key={section} className="field-section">
// // //                   <h3 className="section-heading">{section}</h3>
// // //                   <div className="fields-grid">
// // //                     {fields.map((field, idx) => (
// // //                       <label key={idx} className="field-checkbox-modern">
// // //                         <input
// // //                           type="checkbox"
// // //                           checked={verifiedFields[field.label] || false}
// // //                           onChange={() => toggleField(field.label)}
// // //                         />
// // //                         <div className="checkbox-custom">
// // //                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                             <polyline points="20 6 9 17 4 12"></polyline>
// // //                           </svg>
// // //                         </div>
// // //                         <div className="field-info">
// // //                           <span className="field-label">{field.label}</span>
// // //                           <span className="field-value">{field.value}</span>
// // //                         </div>
// // //                       </label>
// // //                     ))}
// // //                   </div>
// // //                 </div>
// // //               ))}

// // //               <div className="rejection-note">
// // //                 <label htmlFor="reject-reason">Rejection Message (optional)</label>
// // //                 <textarea
// // //                   id="reject-reason"
// // //                   value={rejectReason}
// // //                   onChange={(e) => setRejectReason(e.target.value)}
// // //                   placeholder="Enter a message that will be sent to the seller if rejecting..."
// // //                   rows="3"
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div className="modal-footer-modern">
// // //               <button
// // //                 className="btn-modal btn-approve-modal"
// // //                 onClick={handleApproveCompany}
// // //                 disabled={!isAllVerified() || actionLoading}
// // //               >
// // //                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                   <polyline points="20 6 9 17 4 12"></polyline>
// // //                 </svg>
// // //                 {isAllVerified() ? "Approve Company" : `Verify ${getAllCompanyFields(selectedCompany.company).length - getVerifiedCount()} more fields`}
// // //               </button>
// // //               <button 
// // //                 className="btn-modal btn-reject-modal" 
// // //                 onClick={handleRejectCompany}
// // //                 disabled={actionLoading}
// // //               >
// // //                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// // //                   <line x1="18" y1="6" x2="6" y2="18"></line>
// // //                   <line x1="6" y1="6" x2="18" y2="18"></line>
// // //                 </svg>
// // //                 Request Corrections
// // //               </button>
// // //               <button 
// // //                 className="btn-modal btn-cancel-modal" 
// // //                 onClick={() => setSelectedCompany(null)}
// // //                 disabled={actionLoading}
// // //               >
// // //                 Cancel
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Requests;





// // import { useEffect, useState } from "react";
// // import api from "../services/api.js";
// // import "./Requests.css";

// // const Requests = () => {
// //   const [data, setData] = useState({
// //     individualSellers: [],
// //     professionalSellers: [],
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [verifiedFields, setVerifiedFields] = useState({});
// //   const [rejectReason, setRejectReason] = useState("");
// //   const [actionLoading, setActionLoading] = useState(false);

// //   useEffect(() => {
// //     fetchRequests();
// //   }, []);

// //   const fetchRequests = async () => {
// //     try {
// //       const res = await api.get("/admin/requests/pending");
// //       console.log("✅ API Response:", res.data);
// //       setData(res.data.data || { individualSellers: [], professionalSellers: [] });
// //     } catch (err) {
// //       setError("Failed to load requests");
// //       console.error("❌ Fetch error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getSellerId = (seller) => {
// //     return seller?._id || seller?.id || null;
// //   };

// //   const handleApproveIndividual = async (seller) => {
// //     const sellerId = getSellerId(seller);
// //     console.log("🔍 Approving seller:", { seller, sellerId });
    
// //     if (!sellerId) {
// //       alert("❌ Error: Seller ID not found");
// //       return;
// //     }
    
// //     if (!window.confirm(`Approve ${seller.seller_name}?`)) return;
    
// //     setActionLoading(true);
// //     try {
// //       await api.patch(`/admin/seller/${sellerId}/approve`);
// //       alert("✅ Seller approved! Email sent.");
// //       fetchRequests();
// //     } catch (err) {
// //       console.error("❌ Approve error:", err);
// //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleRejectIndividual = async (seller) => {
// //     const sellerId = getSellerId(seller);
// //     if (!sellerId) {
// //       alert("❌ Error: Seller ID not found");
// //       return;
// //     }
    
// //     const reason = prompt("Enter rejection reason:");
// //     if (!reason) return;
    
// //     setActionLoading(true);
// //     try {
// //       await api.patch(`/admin/seller/${sellerId}/reject`, { reason });
// //       alert("❌ Seller rejected! Email sent.");
// //       fetchRequests();
// //     } catch (err) {
// //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleSuspendIndividual = async (seller) => {
// //     const sellerId = getSellerId(seller);
// //     if (!sellerId) {
// //       alert("❌ Error: Seller ID not found");
// //       return;
// //     }
    
// //     const reason = prompt("Enter suspension reason:");
// //     if (!reason) return;
    
// //     setActionLoading(true);
// //     try {
// //       await api.patch(`/admin/seller/${sellerId}/suspend`, { reason });
// //       alert("⚠️ Seller suspended! Email sent.");
// //       fetchRequests();
// //     } catch (err) {
// //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const openCompanyModal = (item) => {
// //     console.log("🔍 Opening company modal:", item);
// //     setSelectedCompany(item);
// //     setVerifiedFields({});
// //     setRejectReason("");
// //   };

// //   const toggleField = (fieldName) => {
// //     setVerifiedFields((prev) => ({
// //       ...prev,
// //       [fieldName]: !prev[fieldName],
// //     }));
// //   };

// //   const selectAllFields = () => {
// //     const allFields = getAllCompanyFields(selectedCompany?.company);
// //     const allChecked = {};
// //     allFields.forEach((f) => (allChecked[f.label] = true));
// //     setVerifiedFields(allChecked);
// //   };

// //   const deselectAllFields = () => {
// //     setVerifiedFields({});
// //   };

// //   const getAllCompanyFields = (company) => {
// //     if (!company) return [];

// //     const fields = [];

// //     if (company.companyBasicInfo) {
// //       const basic = company.companyBasicInfo;
// //       if (basic.companyName) fields.push({ label: "Company Name", value: basic.companyName, section: "Basic Info" });
// //       if (basic.company_registration_number) fields.push({ label: "Registration Number", value: basic.company_registration_number, section: "Basic Info" });
// //       if (basic.locationOfRegistration) fields.push({ label: "Location of Registration", value: basic.locationOfRegistration, section: "Basic Info" });
// //       if (basic.businessType) fields.push({ label: "Business Type", value: basic.businessType, section: "Basic Info" });
// //       if (basic.taxType) fields.push({ label: "Tax Type", value: basic.taxType, section: "Basic Info" });
// //       if (basic.companyEmail) fields.push({ label: "Company Email", value: basic.companyEmail, section: "Basic Info" });
// //       if (basic.companyPhoneNumber) fields.push({ label: "Phone Number", value: basic.companyPhoneNumber, section: "Basic Info" });
// //       if (basic.companyWebsite) fields.push({ label: "Website", value: basic.companyWebsite, section: "Basic Info" });
// //       if (basic.yearEstablished) fields.push({ label: "Year Established", value: basic.yearEstablished, section: "Basic Info" });
// //       if (basic.numberOfEmployees) fields.push({ label: "Number of Employees", value: basic.numberOfEmployees, section: "Basic Info" });
// //     }

// //     if (company.companyAddress) {
// //       const addr = company.companyAddress;
// //       if (addr.street) fields.push({ label: "Street Address", value: addr.street, section: "Address" });
// //       if (addr.city) fields.push({ label: "City", value: addr.city, section: "Address" });
// //       if (addr.postalCode) fields.push({ label: "Postal Code", value: addr.postalCode, section: "Address" });
// //       if (addr.state) fields.push({ label: "State/Province", value: addr.state, section: "Address" });
// //       if (addr.country) fields.push({ label: "Country", value: addr.country, section: "Address" });
// //     }

// //     if (company.legalInfo) {
// //       const legal = company.legalInfo;
// //       if (legal.legalName) fields.push({ label: "Legal Name", value: legal.legalName, section: "Legal Info" });
// //       if (legal.vatNumber) fields.push({ label: "VAT Number", value: legal.vatNumber, section: "Legal Info" });
// //       if (legal.taxId) fields.push({ label: "Tax ID", value: legal.taxId, section: "Legal Info" });
// //       if (legal.registrationCertificateUrl) fields.push({ label: "Registration Certificate", value: "📄 Uploaded", section: "Legal Info" });
// //       if (legal.taxCertificateUrl) fields.push({ label: "Tax Certificate", value: "📄 Uploaded", section: "Legal Info" });
// //       if (legal.businessLicenseUrl) fields.push({ label: "Business License", value: "📄 Uploaded", section: "Legal Info" });
// //     }

// //     if (company.bankInfo) {
// //       const bank = company.bankInfo;
// //       if (bank.bankName) fields.push({ label: "Bank Name", value: bank.bankName, section: "Bank Info" });
// //       if (bank.accountNumber) fields.push({ label: "Account Number", value: "****" + bank.accountNumber.substring(bank.accountNumber.length - 4), section: "Bank Info" });
// //       if (bank.accountHolderName) fields.push({ label: "Account Holder", value: bank.accountHolderName, section: "Bank Info" });
// //       if (bank.bankBranch) fields.push({ label: "Bank Branch", value: bank.bankBranch, section: "Bank Info" });
// //       if (bank.swiftCode) fields.push({ label: "SWIFT Code", value: bank.swiftCode, section: "Bank Info" });
// //       if (bank.currency) fields.push({ label: "Currency", value: bank.currency, section: "Bank Info" });
// //     }

// //     if (company.representativeInfo) {
// //       const rep = company.representativeInfo;
// //       if (rep.fullName) fields.push({ label: "Representative Name", value: rep.fullName, section: "Representative" });
// //       if (rep.position) fields.push({ label: "Position", value: rep.position, section: "Representative" });
// //       if (rep.email) fields.push({ label: "Representative Email", value: rep.email, section: "Representative" });
// //       if (rep.phoneNumber) fields.push({ label: "Representative Phone", value: rep.phoneNumber, section: "Representative" });
// //       if (rep.idDocumentType) fields.push({ label: "ID Document Type", value: rep.idDocumentType, section: "Representative" });
// //       if (rep.idDocumentNumber) fields.push({ label: "ID Number", value: rep.idDocumentNumber, section: "Representative" });
// //       if (rep.idDocumentUrl) fields.push({ label: "ID Document", value: "📄 Uploaded", section: "Representative" });
// //     }

// //     if (company.billingInfo) {
// //       const bill = company.billingInfo;
// //       if (bill.billingAddress) fields.push({ label: "Billing Address", value: bill.billingAddress, section: "Billing" });
// //       if (bill.billingEmail) fields.push({ label: "Billing Email", value: bill.billingEmail, section: "Billing" });
// //       if (bill.paymentTerms) fields.push({ label: "Payment Terms", value: bill.paymentTerms, section: "Billing" });
// //     }

// //     if (company.additionalInfo) {
// //       const add = company.additionalInfo;
// //       if (add.description) fields.push({ label: "Company Description", value: add.description, section: "Additional" });
// //       if (add.logoUrl) fields.push({ label: "Company Logo", value: "🖼️ Uploaded", section: "Additional" });
// //       if (add.categoriesOfProducts && add.categoriesOfProducts.length > 0) {
// //         fields.push({ label: "Product Categories", value: add.categoriesOfProducts.join(", "), section: "Additional" });
// //       }
// //       if (add.shippingCapabilities) fields.push({ label: "Shipping Capabilities", value: add.shippingCapabilities, section: "Additional" });
// //       if (add.returnPolicy) fields.push({ label: "Return Policy", value: add.returnPolicy, section: "Additional" });
// //     }

// //     return fields;
// //   };

// //   const getVerifiedCount = () => {
// //     return Object.values(verifiedFields).filter(Boolean).length;
// //   };

// //   const isAllVerified = () => {
// //     const allFields = getAllCompanyFields(selectedCompany?.company);
// //     return allFields.length > 0 && allFields.every((f) => verifiedFields[f.label]);
// //   };

// //   const handleApproveCompany = async () => {
// //     if (!isAllVerified()) {
// //       alert("⚠️ Please verify all fields before approving!");
// //       return;
// //     }
// //     if (!window.confirm("✅ Approve this company?")) return;

// //     setActionLoading(true);
// //     try {
// //       const companyId = selectedCompany.company._id || selectedCompany.company.id;
// //       const allFields = getAllCompanyFields(selectedCompany.company);
// //       await api.patch(`/admin/company/${companyId}/approve`, {
// //         verifiedFields: allFields.map(f => f.label),
// //       });
// //       alert("✅ Company approved! Email sent to seller.");
// //       setSelectedCompany(null);
// //       fetchRequests();
// //     } catch (err) {
// //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleRejectCompany = async () => {
// //     const unverifiedFields = getAllCompanyFields(selectedCompany.company)
// //       .filter((f) => !verifiedFields[f.label])
// //       .map((f) => f.label);

// //     if (unverifiedFields.length === 0) {
// //       alert("✅ All fields are verified. Use Approve instead!");
// //       return;
// //     }

// //     const message = rejectReason || "Please correct the following fields";
// //     if (!window.confirm(`❌ Reject and send corrections for ${unverifiedFields.length} fields?`)) return;

// //     setActionLoading(true);
// //     try {
// //       const companyId = selectedCompany.company._id || selectedCompany.company.id;
// //       await api.patch(`/admin/company/${companyId}/reject`, {
// //         invalidFields: unverifiedFields,
// //         message,
// //       });
// //       alert("❌ Company rejected! Email sent with correction details.");
// //       setSelectedCompany(null);
// //       fetchRequests();
// //     } catch (err) {
// //       alert("❌ Error: " + (err.response?.data?.message || err.message));
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const getFieldsBySection = () => {
// //     const allFields = getAllCompanyFields(selectedCompany?.company);
// //     const sections = {};
// //     allFields.forEach(field => {
// //       if (!sections[field.section]) {
// //         sections[field.section] = [];
// //       }
// //       sections[field.section].push(field);
// //     });
// //     return sections;
// //   };

// //   if (loading) {
// //     return (
// //       <div className="requests-page">
// //         <div className="loading-container">
// //           <div className="spinner"></div>
// //           <p>Loading verification requests...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="requests-page">
// //         <div className="error-container">
// //           <div className="error-icon">⚠️</div>
// //           <h2>Oops! Something went wrong</h2>
// //           <p>{error}</p>
// //           <button className="btn-retry" onClick={fetchRequests}>Try Again</button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="requests-page">
// //       <div className="page-header">
// //         <div className="header-content">
// //           <h1>📋 Verification Requests</h1>
// //           <p className="subtitle">Review and approve pending seller applications</p>
// //         </div>
// //         <div className="stats">
// //           <div className="stat-card">
// //             <div className="stat-value">{data.individualSellers.length}</div>
// //             <div className="stat-label">Individual</div>
// //           </div>
// //           <div className="stat-card">
// //             <div className="stat-value">{data.professionalSellers.length}</div>
// //             <div className="stat-label">Professional</div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* INDIVIDUAL SELLERS */}
// //       <section className="section-modern">
// //         <div className="section-header">
// //           <div className="section-title">
// //             <div className="icon-wrapper individual">
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
// //                 <circle cx="12" cy="7" r="4"></circle>
// //               </svg>
// //             </div>
// //             <div>
// //               <h2>Individual Sellers</h2>
// //               <p>{data.individualSellers.length} pending applications</p>
// //             </div>
// //           </div>
// //         </div>

// //         {data.individualSellers.length === 0 ? (
// //           <div className="empty-state">
// //             <div className="empty-icon">📭</div>
// //             <h3>No pending individual sellers</h3>
// //             <p>All individual seller applications have been processed</p>
// //           </div>
// //         ) : (
// //           <div className="cards-grid-modern">
// //             {data.individualSellers.map((seller) => (
// //               <div key={seller._id || seller.id} className="seller-card individual-card">
// //                 <div className="card-badge">Pending Review</div>
// //                 <div className="seller-avatar">
// //                   {seller.seller_name?.charAt(0).toUpperCase() || "S"}
// //                 </div>
// //                 <div className="seller-info">
// //                   <h3>{seller.seller_name || "Unknown Seller"}</h3>
// //                   <div className="info-row">
// //                     <span className="label">Email:</span>
// //                     <span className="value">{seller.seller_email || "N/A"}</span>
// //                   </div>
// //                   <div className="info-row">
// //                     <span className="label">Country:</span>
// //                     <span className="value">{seller.seller_country || "N/A"}</span>
// //                   </div>
// //                   <div className="info-row">
// //                     <span className="label">Address:</span>
// //                     <span className="value">{seller.seller_address || "N/A"}</span>
// //                   </div>
// //                 </div>
// //                 <div className="card-actions-modern">
// //                   <button 
// //                     className="btn-modern btn-approve" 
// //                     onClick={() => handleApproveIndividual(seller)}
// //                     disabled={actionLoading}
// //                   >
// //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                       <polyline points="20 6 9 17 4 12"></polyline>
// //                     </svg>
// //                     <span>Approve</span>
// //                   </button>
// //                   <button 
// //                     className="btn-modern btn-reject" 
// //                     onClick={() => handleRejectIndividual(seller)}
// //                     disabled={actionLoading}
// //                   >
// //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                       <line x1="18" y1="6" x2="6" y2="18"></line>
// //                       <line x1="6" y1="6" x2="18" y2="18"></line>
// //                     </svg>
// //                     <span>Reject</span>
// //                   </button>
// //                   <button 
// //                     className="btn-modern btn-suspend" 
// //                     onClick={() => handleSuspendIndividual(seller)}
// //                     disabled={actionLoading}
// //                   >
// //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                       <circle cx="12" cy="12" r="10"></circle>
// //                       <line x1="15" y1="9" x2="9" y2="15"></line>
// //                       <line x1="9" y1="9" x2="15" y2="15"></line>
// //                     </svg>
// //                     <span>Suspend</span>
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </section>

// //       {/* PROFESSIONAL SELLERS WITH COMPANIES */}
// //       <section className="section-modern">
// //         <div className="section-header">
// //           <div className="section-title">
// //             <div className="icon-wrapper professional">
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
// //                 <polyline points="9 22 9 12 15 12 15 22"></polyline>
// //               </svg>
// //             </div>
// //             <div>
// //               <h2>Professional Sellers & Companies</h2>
// //               <p>{data.professionalSellers.length} pending applications</p>
// //             </div>
// //           </div>
// //         </div>

// //         {data.professionalSellers.length === 0 ? (
// //           <div className="empty-state">
// //             <div className="empty-icon">🏢</div>
// //             <h3>No pending professional sellers</h3>
// //             <p>All company applications have been processed</p>
// //           </div>
// //         ) : (
// //           <div className="cards-grid-modern">
// //             {data.professionalSellers.map((item) => (
// //               <div key={item.seller?._id || item.seller?.id} className="seller-card professional-card">
// //                 <div className="card-badge professional-badge">Professional</div>
// //                 <div className="company-header">
// //                   <div className="company-logo">
// //                     {item.company?.companyBasicInfo?.companyName?.charAt(0).toUpperCase() || "C"}
// //                   </div>
// //                   <div>
// //                     <h3>{item.company?.companyBasicInfo?.companyName || "Company Name Missing"}</h3>
// //                     <p className="seller-tag">by {item.seller?.seller_name || "Unknown"}</p>
// //                   </div>
// //                 </div>
// //                 <div className="company-details">
// //                   <div className="detail-item">
// //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
// //                       <circle cx="12" cy="7" r="4"></circle>
// //                     </svg>
// //                     <span>{item.seller?.seller_name || "N/A"}</span>
// //                   </div>
// //                   <div className="detail-item">
// //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                       <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
// //                       <polyline points="22,6 12,13 2,6"></polyline>
// //                     </svg>
// //                     <span>{item.seller?.seller_email || "N/A"}</span>
// //                   </div>
// //                   <div className="detail-item">
// //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
// //                       <circle cx="12" cy="10" r="3"></circle>
// //                     </svg>
// //                     <span>{item.company?.companyBasicInfo?.locationOfRegistration || "N/A"}</span>
// //                   </div>
// //                   <div className="detail-item">
// //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
// //                       <polyline points="14 2 14 8 20 8"></polyline>
// //                     </svg>
// //                     <span>Reg: {item.company?.companyBasicInfo?.company_registration_number || "N/A"}</span>
// //                   </div>
// //                 </div>
// //                 <button 
// //                   className="btn-verify-company" 
// //                   onClick={() => openCompanyModal(item)}
// //                 >
// //                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                     <path d="M9 11l3 3L22 4"></path>
// //                     <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
// //                   </svg>
// //                   Verify Company Details
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </section>

// //       {/* COMPANY VERIFICATION MODAL */}
// //       {selectedCompany && (
// //         <div className="modal-backdrop" onClick={() => setSelectedCompany(null)}>
// //           <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
// //             <div className="modal-header-modern">
// //               <div className="modal-title-section">
// //                 <h2>🔍 Company Verification</h2>
// //                 <p>{selectedCompany.company?.companyBasicInfo?.companyName}</p>
// //               </div>
// //               <button className="btn-close-modern" onClick={() => setSelectedCompany(null)}>
// //                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                   <line x1="18" y1="6" x2="6" y2="18"></line>
// //                   <line x1="6" y1="6" x2="18" y2="18"></line>
// //                 </svg>
// //               </button>
// //             </div>

// //             <div className="modal-toolbar">
// //               <div className="toolbar-left">
// //                 <button className="btn-tool" onClick={selectAllFields}>
// //                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                     <polyline points="20 6 9 17 4 12"></polyline>
// //                   </svg>
// //                   Select All
// //                 </button>
// //                 <button className="btn-tool" onClick={deselectAllFields}>
// //                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
// //                   </svg>
// //                   Clear All
// //                 </button>
// //               </div>
// //               <div className="progress-indicator">
// //                 <div className="progress-circle">
// //                   <svg width="40" height="40">
// //                     <circle cx="20" cy="20" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4"/>
// //                     <circle 
// //                       cx="20" 
// //                       cy="20" 
// //                       r="18" 
// //                       fill="none" 
// //                       stroke="#10b981" 
// //                       strokeWidth="4"
// //                       strokeDasharray={`${2 * Math.PI * 18}`}
// //                       strokeDashoffset={`${2 * Math.PI * 18 * (1 - getVerifiedCount() / getAllCompanyFields(selectedCompany.company).length)}`}
// //                       transform="rotate(-90 20 20)"
// //                     />
// //                   </svg>
// //                   <span className="progress-text">{getVerifiedCount()}/{getAllCompanyFields(selectedCompany.company).length}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="modal-body-modern">
// //               {Object.entries(getFieldsBySection()).map(([section, fields]) => (
// //                 <div key={section} className="field-section">
// //                   <h3 className="section-heading">{section}</h3>
// //                   <div className="fields-grid">
// //                     {fields.map((field, idx) => (
// //                       <label key={idx} className="field-checkbox-modern">
// //                         <input
// //                           type="checkbox"
// //                           checked={verifiedFields[field.label] || false}
// //                           onChange={() => toggleField(field.label)}
// //                         />
// //                         <div className="checkbox-custom">
// //                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                             <polyline points="20 6 9 17 4 12"></polyline>
// //                           </svg>
// //                         </div>
// //                         <div className="field-info">
// //                           <span className="field-label">{field.label}</span>
// //                           <span className="field-value">{field.value}</span>
// //                         </div>
// //                       </label>
// //                     ))}
// //                   </div>
// //                 </div>
// //               ))}

// //               <div className="rejection-note">
// //                 <label htmlFor="reject-reason">Rejection Message (optional)</label>
// //                 <textarea
// //                   id="reject-reason"
// //                   value={rejectReason}
// //                   onChange={(e) => setRejectReason(e.target.value)}
// //                   placeholder="Enter a message that will be sent to the seller if rejecting..."
// //                   rows="3"
// //                 />
// //               </div>
// //             </div>

// //             <div className="modal-footer-modern">
// //               <button
// //                 className="btn-modal btn-approve-modal"
// //                 onClick={handleApproveCompany}
// //                 disabled={!isAllVerified() || actionLoading}
// //               >
// //                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                   <polyline points="20 6 9 17 4 12"></polyline>
// //                 </svg>
// //                 {isAllVerified() ? "Approve Company" : `Verify ${getAllCompanyFields(selectedCompany.company).length - getVerifiedCount()} more fields`}
// //               </button>
// //               <button 
// //                 className="btn-modal btn-reject-modal" 
// //                 onClick={handleRejectCompany}
// //                 disabled={actionLoading}
// //               >
// //                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //                   <line x1="18" y1="6" x2="6" y2="18"></line>
// //                   <line x1="6" y1="6" x2="18" y2="18"></line>
// //                 </svg>
// //                 Request Corrections
// //               </button>
// //               <button 
// //                 className="btn-modal btn-cancel-modal" 
// //                 onClick={() => setSelectedCompany(null)}
// //                 disabled={actionLoading}
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Requests;









// import { useEffect, useState } from "react";
// import api from "../services/api.js";
// import "./Requests.css";

// const Requests = () => {
//   const [data, setData] = useState({
//     individualSellers: [],
//     professionalSellers: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [verifiedFields, setVerifiedFields] = useState({});
//   const [rejectReason, setRejectReason] = useState("");
//   const [actionLoading, setActionLoading] = useState(false);

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const res = await api.get("/admin/requests/pending");
//       console.log("✅ API Response:", res.data);
//       setData(res.data.data || { individualSellers: [], professionalSellers: [] });
//     } catch (err) {
//       setError("Failed to load requests");
//       console.error("❌ Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSellerId = (seller) => {
//     return seller?._id || seller?.id || null;
//   };

//   const handleApproveIndividual = async (seller) => {
//     const sellerId = getSellerId(seller);
//     console.log("🔍 Approving seller:", { seller, sellerId });
    
//     if (!sellerId) {
//       alert("❌ Error: Seller ID not found");
//       return;
//     }
    
//     if (!window.confirm(`Approve ${seller.seller_name}?`)) return;
    
//     setActionLoading(true);
//     try {
//       await api.patch(`/admin/seller/${sellerId}/approve`);
//       alert("✅ Seller approved! Email sent.");
//       fetchRequests();
//     } catch (err) {
//       console.error("❌ Approve error:", err);
//       alert("❌ Error: " + (err.response?.data?.message || err.message));
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleRejectIndividual = async (seller) => {
//     const sellerId = getSellerId(seller);
//     if (!sellerId) {
//       alert("❌ Error: Seller ID not found");
//       return;
//     }
    
//     const reason = prompt("Enter rejection reason:");
//     if (!reason) return;
    
//     setActionLoading(true);
//     try {
//       await api.patch(`/admin/seller/${sellerId}/reject`, { reason });
//       alert("❌ Seller rejected! Email sent.");
//       fetchRequests();
//     } catch (err) {
//       alert("❌ Error: " + (err.response?.data?.message || err.message));
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleSuspendIndividual = async (seller) => {
//     const sellerId = getSellerId(seller);
//     if (!sellerId) {
//       alert("❌ Error: Seller ID not found");
//       return;
//     }
    
//     const reason = prompt("Enter suspension reason:");
//     if (!reason) return;
    
//     setActionLoading(true);
//     try {
//       await api.patch(`/admin/seller/${sellerId}/suspend`, { reason });
//       alert("⚠️ Seller suspended! Email sent.");
//       fetchRequests();
//     } catch (err) {
//       alert("❌ Error: " + (err.response?.data?.message || err.message));
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const openCompanyModal = (item) => {
//     console.log("🔍 Opening company modal:", item);
//     setSelectedCompany(item);
//     setVerifiedFields({});
//     setRejectReason("");
//   };

//   const toggleField = (fieldName) => {
//     setVerifiedFields((prev) => ({
//       ...prev,
//       [fieldName]: !prev[fieldName],
//     }));
//   };

//   const selectAllFields = () => {
//     const allFields = getAllCompanyFields(selectedCompany?.company);
//     const allChecked = {};
//     allFields.forEach((f) => (allChecked[f.label] = true));
//     setVerifiedFields(allChecked);
//   };

//   const deselectAllFields = () => {
//     setVerifiedFields({});
//   };

//   const getAllCompanyFields = (company) => {
//     if (!company) return [];

//     const fields = [];

//     if (company.companyBasicInfo) {
//       const basic = company.companyBasicInfo;
//       if (basic.companyName) fields.push({ label: "Company Name", value: basic.companyName, section: "Basic Info" });
//       if (basic.company_registration_number) fields.push({ label: "Registration Number", value: basic.company_registration_number, section: "Basic Info" });
//       if (basic.locationOfRegistration) fields.push({ label: "Location of Registration", value: basic.locationOfRegistration, section: "Basic Info" });
//       if (basic.businessType) fields.push({ label: "Business Type", value: basic.businessType, section: "Basic Info" });
//       if (basic.taxType) fields.push({ label: "Tax Type", value: basic.taxType, section: "Basic Info" });
//       if (basic.companyEmail) fields.push({ label: "Company Email", value: basic.companyEmail, section: "Basic Info" });
//       if (basic.companyPhoneNumber) fields.push({ label: "Phone Number", value: basic.companyPhoneNumber, section: "Basic Info" });
//       if (basic.companyWebsite) fields.push({ label: "Website", value: basic.companyWebsite, section: "Basic Info" });
//       if (basic.yearEstablished) fields.push({ label: "Year Established", value: basic.yearEstablished, section: "Basic Info" });
//       if (basic.numberOfEmployees) fields.push({ label: "Number of Employees", value: basic.numberOfEmployees, section: "Basic Info" });
//     }

//     if (company.companyAddress) {
//       const addr = company.companyAddress;
//       if (addr.street) fields.push({ label: "Street Address", value: addr.street, section: "Address" });
//       if (addr.city) fields.push({ label: "City", value: addr.city, section: "Address" });
//       if (addr.postalCode) fields.push({ label: "Postal Code", value: addr.postalCode, section: "Address" });
//       if (addr.state) fields.push({ label: "State/Province", value: addr.state, section: "Address" });
//       if (addr.country) fields.push({ label: "Country", value: addr.country, section: "Address" });
//     }

//     if (company.legalInfo) {
//       const legal = company.legalInfo;
//       if (legal.legalName) fields.push({ label: "Legal Name", value: legal.legalName, section: "Legal Info" });
//       if (legal.vatNumber) fields.push({ label: "VAT Number", value: legal.vatNumber, section: "Legal Info" });
//       if (legal.taxId) fields.push({ label: "Tax ID", value: legal.taxId, section: "Legal Info" });
//       if (legal.registrationCertificateUrl) fields.push({ label: "Registration Certificate", value: "📄 Uploaded", section: "Legal Info" });
//       if (legal.taxCertificateUrl) fields.push({ label: "Tax Certificate", value: "📄 Uploaded", section: "Legal Info" });
//       if (legal.businessLicenseUrl) fields.push({ label: "Business License", value: "📄 Uploaded", section: "Legal Info" });
//     }

//     if (company.bankInfo) {
//       const bank = company.bankInfo;
//       if (bank.bankName) fields.push({ label: "Bank Name", value: bank.bankName, section: "Bank Info" });
//       if (bank.accountNumber) fields.push({ label: "Account Number", value: "****" + bank.accountNumber.substring(bank.accountNumber.length - 4), section: "Bank Info" });
//       if (bank.accountHolderName) fields.push({ label: "Account Holder", value: bank.accountHolderName, section: "Bank Info" });
//       if (bank.bankBranch) fields.push({ label: "Bank Branch", value: bank.bankBranch, section: "Bank Info" });
//       if (bank.swiftCode) fields.push({ label: "SWIFT Code", value: bank.swiftCode, section: "Bank Info" });
//       if (bank.currency) fields.push({ label: "Currency", value: bank.currency, section: "Bank Info" });
//     }

//     if (company.representativeInfo) {
//       const rep = company.representativeInfo;
//       if (rep.fullName) fields.push({ label: "Representative Name", value: rep.fullName, section: "Representative" });
//       if (rep.position) fields.push({ label: "Position", value: rep.position, section: "Representative" });
//       if (rep.email) fields.push({ label: "Representative Email", value: rep.email, section: "Representative" });
//       if (rep.phoneNumber) fields.push({ label: "Representative Phone", value: rep.phoneNumber, section: "Representative" });
//       if (rep.idDocumentType) fields.push({ label: "ID Document Type", value: rep.idDocumentType, section: "Representative" });
//       if (rep.idDocumentNumber) fields.push({ label: "ID Number", value: rep.idDocumentNumber, section: "Representative" });
//       if (rep.idDocumentUrl) fields.push({ label: "ID Document", value: "📄 Uploaded", section: "Representative" });
//     }

//     if (company.billingInfo) {
//       const bill = company.billingInfo;
//       if (bill.billingAddress) fields.push({ label: "Billing Address", value: bill.billingAddress, section: "Billing" });
//       if (bill.billingEmail) fields.push({ label: "Billing Email", value: bill.billingEmail, section: "Billing" });
//       if (bill.paymentTerms) fields.push({ label: "Payment Terms", value: bill.paymentTerms, section: "Billing" });
//     }

//     if (company.additionalInfo) {
//       const add = company.additionalInfo;
//       if (add.description) fields.push({ label: "Company Description", value: add.description, section: "Additional" });
//       if (add.logoUrl) fields.push({ label: "Company Logo", value: "🖼️ Uploaded", section: "Additional" });
//       if (add.categoriesOfProducts && add.categoriesOfProducts.length > 0) {
//         fields.push({ label: "Product Categories", value: add.categoriesOfProducts.join(", "), section: "Additional" });
//       }
//       if (add.shippingCapabilities) fields.push({ label: "Shipping Capabilities", value: add.shippingCapabilities, section: "Additional" });
//       if (add.returnPolicy) fields.push({ label: "Return Policy", value: add.returnPolicy, section: "Additional" });
//     }

//     return fields;
//   };

//   const getVerifiedCount = () => {
//     return Object.values(verifiedFields).filter(Boolean).length;
//   };

//   const isAllVerified = () => {
//     const allFields = getAllCompanyFields(selectedCompany?.company);
//     return allFields.length > 0 && allFields.every((f) => verifiedFields[f.label]);
//   };

//   const handleApproveCompany = async () => {
//     if (!isAllVerified()) {
//       alert("⚠️ Please verify all fields before approving!");
//       return;
//     }
//     if (!window.confirm("✅ Approve this company?")) return;

//     setActionLoading(true);
//     try {
//       const companyId = selectedCompany.company._id || selectedCompany.company.id;
//       const allFields = getAllCompanyFields(selectedCompany.company);
//       await api.patch(`/admin/company/${companyId}/approve`, {
//         verifiedFields: allFields.map(f => f.label),
//       });
//       alert("✅ Company approved! Email sent to seller.");
//       setSelectedCompany(null);
//       fetchRequests();
//     } catch (err) {
//       alert("❌ Error: " + (err.response?.data?.message || err.message));
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleRejectCompany = async () => {
//     const unverifiedFields = getAllCompanyFields(selectedCompany.company)
//       .filter((f) => !verifiedFields[f.label])
//       .map((f) => f.label);

//     if (unverifiedFields.length === 0) {
//       alert("✅ All fields are verified. Use Approve instead!");
//       return;
//     }

//     const message = rejectReason || "Please correct the following fields";
//     if (!window.confirm(`❌ Reject and send corrections for ${unverifiedFields.length} fields?`)) return;

//     setActionLoading(true);
//     try {
//       const companyId = selectedCompany.company._id || selectedCompany.company.id;
//       await api.patch(`/admin/company/${companyId}/reject`, {
//         invalidFields: unverifiedFields,
//         message,
//       });
//       alert("❌ Company rejected! Email sent with correction details.");
//       setSelectedCompany(null);
//       fetchRequests();
//     } catch (err) {
//       alert("❌ Error: " + (err.response?.data?.message || err.message));
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getFieldsBySection = () => {
//     const allFields = getAllCompanyFields(selectedCompany?.company);
//     const sections = {};
//     allFields.forEach(field => {
//       if (!sections[field.section]) {
//         sections[field.section] = [];
//       }
//       sections[field.section].push(field);
//     });
//     return sections;
//   };

//   if (loading) {
//     return (
//       <div className="requests-page">
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Loading verification requests...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="requests-page">
//         <div className="error-container">
//           <div className="error-icon">⚠️</div>
//           <h2>Oops! Something went wrong</h2>
//           <p>{error}</p>
//           <button className="btn-retry" onClick={fetchRequests}>Try Again</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="requests-page">
//       <div className="page-header">
//         <div className="header-content">
//           <h1>📋 Verification Requests</h1>
//           <p className="subtitle">Review and approve pending seller applications</p>
//         </div>
//         <div className="stats">
//           <div className="stat-card">
//             <div className="stat-value">{data.individualSellers.length}</div>
//             <div className="stat-label">Individual</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-value">{data.professionalSellers.length}</div>
//             <div className="stat-label">Professional</div>
//           </div>
//         </div>
//       </div>

//       {/* INDIVIDUAL SELLERS */}
//       <section className="section-modern">
//         <div className="section-header">
//           <div className="section-title">
//             <div className="icon-wrapper individual">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                 <circle cx="12" cy="7" r="4"></circle>
//               </svg>
//             </div>
//             <div>
//               <h2>Individual Sellers</h2>
//               <p>{data.individualSellers.length} pending applications</p>
//             </div>
//           </div>
//         </div>

//         {data.individualSellers.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">📭</div>
//             <h3>No pending individual sellers</h3>
//             <p>All individual seller applications have been processed</p>
//           </div>
//         ) : (
//           <div className="cards-grid-modern">
//             {data.individualSellers.map((seller) => (
//               <div key={seller._id || seller.id} className="seller-card individual-card">
//                 <div className="card-badge">Pending Review</div>
//                 <div className="seller-avatar">
//                   {seller.seller_name?.charAt(0).toUpperCase() || "S"}
//                 </div>
//                 <div className="seller-info">
//                   <h3>{seller.seller_name || "Unknown Seller"}</h3>
//                   <div className="info-row">
//                     <span className="label">Email:</span>
//                     <span className="value">{seller.seller_email || "N/A"}</span>
//                   </div>
//                   <div className="info-row">
//                     <span className="label">Country:</span>
//                     <span className="value">{seller.seller_country || "N/A"}</span>
//                   </div>
//                   <div className="info-row">
//                     <span className="label">Address:</span>
//                     <span className="value">{seller.seller_address || "N/A"}</span>
//                   </div>
//                 </div>
//                 <div className="card-actions-modern">
//                   <button 
//                     className="btn-modern btn-approve" 
//                     onClick={() => handleApproveIndividual(seller)}
//                     disabled={actionLoading}
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                     <span>Approve</span>
//                   </button>
//                   <button 
//                     className="btn-modern btn-reject" 
//                     onClick={() => handleRejectIndividual(seller)}
//                     disabled={actionLoading}
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <line x1="18" y1="6" x2="6" y2="18"></line>
//                       <line x1="6" y1="6" x2="18" y2="18"></line>
//                     </svg>
//                     <span>Reject</span>
//                   </button>
//                   <button 
//                     className="btn-modern btn-suspend" 
//                     onClick={() => handleSuspendIndividual(seller)}
//                     disabled={actionLoading}
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <circle cx="12" cy="12" r="10"></circle>
//                       <line x1="15" y1="9" x2="9" y2="15"></line>
//                       <line x1="9" y1="9" x2="15" y2="15"></line>
//                     </svg>
//                     <span>Suspend</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* PROFESSIONAL SELLERS WITH COMPANIES */}
//       <section className="section-modern">
//         <div className="section-header">
//           <div className="section-title">
//             <div className="icon-wrapper professional">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//                 <polyline points="9 22 9 12 15 12 15 22"></polyline>
//               </svg>
//             </div>
//             <div>
//               <h2>Professional Sellers & Companies</h2>
//               <p>{data.professionalSellers.length} pending applications</p>
//             </div>
//           </div>
//         </div>

//         {data.professionalSellers.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">🏢</div>
//             <h3>No pending professional sellers</h3>
//             <p>All company applications have been processed</p>
//           </div>
//         ) : (
//           <div className="cards-grid-modern">
//             {data.professionalSellers.map((item) => (
//               <div key={item.seller?._id || item.seller?.id} className="seller-card professional-card">
//                 <div className="card-badge professional-badge">Professional</div>
//                 <div className="company-header">
//                   <div className="company-logo">
//                     {item.company?.companyBasicInfo?.companyName?.charAt(0).toUpperCase() || "C"}
//                   </div>
//                   <div>
//                     <h3>{item.company?.companyBasicInfo?.companyName || "Company Name Missing"}</h3>
//                     <p className="seller-tag">by {item.seller?.seller_name || "Unknown"}</p>
//                   </div>
//                 </div>
//                 <div className="company-details">
//                   <div className="detail-item">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                       <circle cx="12" cy="7" r="4"></circle>
//                     </svg>
//                     <span>{item.seller?.seller_name || "N/A"}</span>
//                   </div>
//                   <div className="detail-item">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
//                       <polyline points="22,6 12,13 2,6"></polyline>
//                     </svg>
//                     <span>{item.seller?.seller_email || "N/A"}</span>
//                   </div>
//                   <div className="detail-item">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//                       <circle cx="12" cy="10" r="3"></circle>
//                     </svg>
//                     <span>{item.company?.companyBasicInfo?.locationOfRegistration || "N/A"}</span>
//                   </div>
//                   <div className="detail-item">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//                       <polyline points="14 2 14 8 20 8"></polyline>
//                     </svg>
//                     <span>Reg: {item.company?.companyBasicInfo?.company_registration_number || "N/A"}</span>
//                   </div>
//                 </div>
//                 <button 
//                   className="btn-verify-company" 
//                   onClick={() => openCompanyModal(item)}
//                 >
//                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <path d="M9 11l3 3L22 4"></path>
//                     <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
//                   </svg>
//                   Verify Company Details
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* COMPANY VERIFICATION MODAL */}
//       {selectedCompany && (
//         <div className="modal-backdrop" onClick={() => setSelectedCompany(null)}>
//           <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header-modern">
//               <div className="modal-title-section">
//                 <h2>🔍 Company Verification</h2>
//                 <p>{selectedCompany.company?.companyBasicInfo?.companyName}</p>
//               </div>
//               <button className="btn-close-modern" onClick={() => setSelectedCompany(null)}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <line x1="18" y1="6" x2="6" y2="18"></line>
//                   <line x1="6" y1="6" x2="18" y2="18"></line>
//                 </svg>
//               </button>
//             </div>

//             <div className="modal-toolbar">
//               <div className="toolbar-left">
//                 <button className="btn-tool" onClick={selectAllFields}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <polyline points="20 6 9 17 4 12"></polyline>
//                   </svg>
//                   Select All
//                 </button>
//                 <button className="btn-tool" onClick={deselectAllFields}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
//                   </svg>
//                   Clear All
//                 </button>
//               </div>
//               <div className="progress-indicator">
//                 <div className="progress-circle">
//                   <svg width="40" height="40">
//                     <circle cx="20" cy="20" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4"/>
//                     <circle 
//                       cx="20" 
//                       cy="20" 
//                       r="18" 
//                       fill="none" 
//                       stroke="#10b981" 
//                       strokeWidth="4"
//                       strokeDasharray={`${2 * Math.PI * 18}`}
//                       strokeDashoffset={`${2 * Math.PI * 18 * (1 - getVerifiedCount() / getAllCompanyFields(selectedCompany.company).length)}`}
//                       transform="rotate(-90 20 20)"
//                     />
//                   </svg>
//                   <span className="progress-text">{getVerifiedCount()}/{getAllCompanyFields(selectedCompany.company).length}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="modal-body-modern">
//               {Object.entries(getFieldsBySection()).map(([section, fields]) => (
//                 <div key={section} className="field-section">
//                   <h3 className="section-heading">{section}</h3>
//                   <div className="fields-grid">
//                     {fields.map((field, idx) => (
//                       <label key={idx} className="field-checkbox-modern">
//                         <input
//                           type="checkbox"
//                           checked={verifiedFields[field.label] || false}
//                           onChange={() => toggleField(field.label)}
//                         />
//                         <div className="checkbox-custom">
//                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <polyline points="20 6 9 17 4 12"></polyline>
//                           </svg>
//                         </div>
//                         <div className="field-info">
//                           <span className="field-label">{field.label}</span>
//                           <span className="field-value">{field.value}</span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               <div className="rejection-note">
//                 <label htmlFor="reject-reason">Rejection Message (optional)</label>
//                 <textarea
//                   id="reject-reason"
//                   value={rejectReason}
//                   onChange={(e) => setRejectReason(e.target.value)}
//                   placeholder="Enter a message that will be sent to the seller if rejecting..."
//                   rows="3"
//                 />
//               </div>
//             </div>

//             <div className="modal-footer-modern">
//               <button
//                 className="btn-modal btn-approve-modal"
//                 onClick={handleApproveCompany}
//                 disabled={!isAllVerified() || actionLoading}
//               >
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <polyline points="20 6 9 17 4 12"></polyline>
//                 </svg>
//                 {isAllVerified() ? "Approve Company" : `Verify ${getAllCompanyFields(selectedCompany.company).length - getVerifiedCount()} more fields`}
//               </button>
//               <button 
//                 className="btn-modal btn-reject-modal" 
//                 onClick={handleRejectCompany}
//                 disabled={actionLoading}
//               >
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <line x1="18" y1="6" x2="6" y2="18"></line>
//                   <line x1="6" y1="6" x2="18" y2="18"></line>
//                 </svg>
//                 Request Corrections
//               </button>
//               <button 
//                 className="btn-modal btn-cancel-modal" 
//                 onClick={() => setSelectedCompany(null)}
//                 disabled={actionLoading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Requests;







import { useEffect, useState } from "react";
import api from "../services/api.js";
import "./Requests.css";

const Requests = () => {
  const [data, setData] = useState({
    individualSellers: [],
    professionalSellers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [verifiedFields, setVerifiedFields] = useState({});
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/admin/requests/pending");
      console.log("✅ API Response:", res.data);
      setData(res.data.data || { individualSellers: [], professionalSellers: [] });
    } catch (err) {
      setError("Failed to load requests");
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSellerId = (seller) => {
    return seller?._id || seller?.id || null;
  };

  const handleApproveIndividual = async (seller) => {
    const sellerId = getSellerId(seller);
    console.log("🔍 Approving seller:", { seller, sellerId });
    
    if (!sellerId) {
      alert("❌ Error: Seller ID not found");
      return;
    }
    
    if (!window.confirm(`Approve ${seller.seller_name}?`)) return;
    
    setActionLoading(true);
    try {
      await api.patch(`/admin/seller/${sellerId}/approve`);
      alert("✅ Seller approved! Email sent.");
      fetchRequests();
    } catch (err) {
      console.error("❌ Approve error:", err);
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectIndividual = async (seller) => {
    const sellerId = getSellerId(seller);
    if (!sellerId) {
      alert("❌ Error: Seller ID not found");
      return;
    }
    
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    setActionLoading(true);
    try {
      await api.patch(`/admin/seller/${sellerId}/reject`, { reason });
      alert("❌ Seller rejected! Email sent.");
      fetchRequests();
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendIndividual = async (seller) => {
    const sellerId = getSellerId(seller);
    if (!sellerId) {
      alert("❌ Error: Seller ID not found");
      return;
    }
    
    const reason = prompt("Enter suspension reason:");
    if (!reason) return;
    
    setActionLoading(true);
    try {
      await api.patch(`/admin/seller/${sellerId}/suspend`, { reason });
      alert("⚠️ Seller suspended! Email sent.");
      fetchRequests();
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const openCompanyModal = (item) => {
    console.log("🔍 Opening company modal:", item);
    setSelectedCompany(item);
    setVerifiedFields({});
    setRejectReason("");
  };

  const toggleField = (fieldName) => {
    setVerifiedFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const selectAllFields = () => {
    const allFields = getAllCompanyFields(selectedCompany?.company);
    const allChecked = {};
    allFields.forEach((f) => (allChecked[f.label] = true));
    setVerifiedFields(allChecked);
  };

  const deselectAllFields = () => {
    setVerifiedFields({});
  };

  const getAllCompanyFields = (company) => {
    if (!company) return [];

    const fields = [];

    if (company.companyBasicInfo) {
      const basic = company.companyBasicInfo;
      if (basic.companyName) fields.push({ label: "Company Name", value: basic.companyName, section: "Basic Info" });
      if (basic.company_registration_number) fields.push({ label: "Registration Number", value: basic.company_registration_number, section: "Basic Info" });
      if (basic.locationOfRegistration) fields.push({ label: "Location of Registration", value: basic.locationOfRegistration, section: "Basic Info" });
      if (basic.businessType) fields.push({ label: "Business Type", value: basic.businessType, section: "Basic Info" });
      if (basic.taxType) fields.push({ label: "Tax Type", value: basic.taxType, section: "Basic Info" });
      if (basic.companyEmail) fields.push({ label: "Company Email", value: basic.companyEmail, section: "Basic Info" });
      if (basic.companyPhoneNumber) fields.push({ label: "Phone Number", value: basic.companyPhoneNumber, section: "Basic Info" });
      if (basic.companyWebsite) fields.push({ label: "Website", value: basic.companyWebsite, section: "Basic Info" });
      if (basic.yearEstablished) fields.push({ label: "Year Established", value: basic.yearEstablished, section: "Basic Info" });
      if (basic.numberOfEmployees) fields.push({ label: "Number of Employees", value: basic.numberOfEmployees, section: "Basic Info" });
    }

    if (company.companyAddress) {
      const addr = company.companyAddress;
      if (addr.street) fields.push({ label: "Street Address", value: addr.street, section: "Address" });
      if (addr.city) fields.push({ label: "City", value: addr.city, section: "Address" });
      if (addr.postalCode) fields.push({ label: "Postal Code", value: addr.postalCode, section: "Address" });
      if (addr.state) fields.push({ label: "State/Province", value: addr.state, section: "Address" });
      if (addr.country) fields.push({ label: "Country", value: addr.country, section: "Address" });
    }

    if (company.legalInfo) {
      const legal = company.legalInfo;
      if (legal.legalName) fields.push({ label: "Legal Name", value: legal.legalName, section: "Legal Info" });
      if (legal.vatNumber) fields.push({ label: "VAT Number", value: legal.vatNumber, section: "Legal Info" });
      if (legal.taxId) fields.push({ label: "Tax ID", value: legal.taxId, section: "Legal Info" });
      if (legal.registrationCertificateUrl) fields.push({ label: "Registration Certificate", value: "📄 Uploaded", section: "Legal Info" });
      if (legal.taxCertificateUrl) fields.push({ label: "Tax Certificate", value: "📄 Uploaded", section: "Legal Info" });
      if (legal.businessLicenseUrl) fields.push({ label: "Business License", value: "📄 Uploaded", section: "Legal Info" });
    }

    if (company.bankInfo) {
      const bank = company.bankInfo;
      if (bank.bankName) fields.push({ label: "Bank Name", value: bank.bankName, section: "Bank Info" });
      if (bank.accountNumber) fields.push({ label: "Account Number", value: "****" + bank.accountNumber.substring(bank.accountNumber.length - 4), section: "Bank Info" });
      if (bank.accountHolderName) fields.push({ label: "Account Holder", value: bank.accountHolderName, section: "Bank Info" });
      if (bank.bankBranch) fields.push({ label: "Bank Branch", value: bank.bankBranch, section: "Bank Info" });
      if (bank.swiftCode) fields.push({ label: "SWIFT Code", value: bank.swiftCode, section: "Bank Info" });
      if (bank.currency) fields.push({ label: "Currency", value: bank.currency, section: "Bank Info" });
    }

    if (company.representativeInfo) {
      const rep = company.representativeInfo;
      if (rep.fullName) fields.push({ label: "Representative Name", value: rep.fullName, section: "Representative" });
      if (rep.position) fields.push({ label: "Position", value: rep.position, section: "Representative" });
      if (rep.email) fields.push({ label: "Representative Email", value: rep.email, section: "Representative" });
      if (rep.phoneNumber) fields.push({ label: "Representative Phone", value: rep.phoneNumber, section: "Representative" });
      if (rep.idDocumentType) fields.push({ label: "ID Document Type", value: rep.idDocumentType, section: "Representative" });
      if (rep.idDocumentNumber) fields.push({ label: "ID Number", value: rep.idDocumentNumber, section: "Representative" });
      if (rep.idDocumentUrl) fields.push({ label: "ID Document", value: "📄 Uploaded", section: "Representative" });
    }

    if (company.billingInfo) {
      const bill = company.billingInfo;
      if (bill.billingAddress) fields.push({ label: "Billing Address", value: bill.billingAddress, section: "Billing" });
      if (bill.billingEmail) fields.push({ label: "Billing Email", value: bill.billingEmail, section: "Billing" });
      if (bill.paymentTerms) fields.push({ label: "Payment Terms", value: bill.paymentTerms, section: "Billing" });
    }

    if (company.additionalInfo) {
      const add = company.additionalInfo;
      if (add.description) fields.push({ label: "Company Description", value: add.description, section: "Additional" });
      if (add.logoUrl) fields.push({ label: "Company Logo", value: "🖼️ Uploaded", section: "Additional" });
      if (add.categoriesOfProducts && add.categoriesOfProducts.length > 0) {
        fields.push({ label: "Product Categories", value: add.categoriesOfProducts.join(", "), section: "Additional" });
      }
      if (add.shippingCapabilities) fields.push({ label: "Shipping Capabilities", value: add.shippingCapabilities, section: "Additional" });
      if (add.returnPolicy) fields.push({ label: "Return Policy", value: add.returnPolicy, section: "Additional" });
    }

    return fields;
  };

  const getVerifiedCount = () => {
    return Object.values(verifiedFields).filter(Boolean).length;
  };

  const isAllVerified = () => {
    const allFields = getAllCompanyFields(selectedCompany?.company);
    return allFields.length > 0 && allFields.every((f) => verifiedFields[f.label]);
  };

  const handleApproveCompany = async () => {
    if (!isAllVerified()) {
      alert("⚠️ Please verify all fields before approving!");
      return;
    }
    if (!window.confirm("✅ Approve this company?")) return;

    setActionLoading(true);
    try {
      const companyId = selectedCompany.company._id || selectedCompany.company.id;
      const allFields = getAllCompanyFields(selectedCompany.company);
      await api.patch(`/admin/company/${companyId}/approve`, {
        verifiedFields: allFields.map(f => f.label),
      });
      alert("✅ Company approved! Email sent to seller.");
      setSelectedCompany(null);
      fetchRequests();
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectCompany = async () => {
    const unverifiedFields = getAllCompanyFields(selectedCompany.company)
      .filter((f) => !verifiedFields[f.label])
      .map((f) => f.label);

    if (unverifiedFields.length === 0) {
      alert("✅ All fields are verified. Use Approve instead!");
      return;
    }

    const message = rejectReason || "Please correct the following fields";
    if (!window.confirm(`❌ Reject and send corrections for ${unverifiedFields.length} fields?`)) return;

    setActionLoading(true);
    try {
      const companyId = selectedCompany.company._id || selectedCompany.company.id;
      await api.patch(`/admin/company/${companyId}/reject`, {
        invalidFields: unverifiedFields,
        message,
      });
      alert("❌ Company rejected! Email sent with correction details.");
      setSelectedCompany(null);
      fetchRequests();
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const getFieldsBySection = () => {
    const allFields = getAllCompanyFields(selectedCompany?.company);
    const sections = {};
    allFields.forEach(field => {
      if (!sections[field.section]) {
        sections[field.section] = [];
      }
      sections[field.section].push(field);
    });
    return sections;
  };

  if (loading) {
    return (
      <div className="requests-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading verification requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="requests-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchRequests}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-page">
      <div className="page-header">
        <div className="header-content">
          <h1>📋 Verification Requests</h1>
          <p className="subtitle">Review and approve pending seller applications</p>
        </div>
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{data.individualSellers.length}</div>
            <div className="stat-label">Individual</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{data.professionalSellers.length}</div>
            <div className="stat-label">Professional</div>
          </div>
        </div>
      </div>

      {/* INDIVIDUAL SELLERS */}
      <section className="section-modern">
        <div className="section-header">
          <div className="section-title">
            <div className="icon-wrapper individual">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h2>Individual Sellers</h2>
              <p>{data.individualSellers.length} pending applications</p>
            </div>
          </div>
        </div>

        {data.individualSellers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No pending individual sellers</h3>
            <p>All individual seller applications have been processed</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="sellers-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>Address</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.individualSellers.map((seller) => (
                  <tr key={seller._id || seller.id}>
                    <td>
                      <div className="seller-name">
                        <div className="seller-avatar-small">
                          {seller.seller_name?.charAt(0).toUpperCase() || "S"}
                        </div>
                        <span>{seller.seller_name || "Unknown Seller"}</span>
                      </div>
                    </td>
                    <td className="seller-email">{seller.seller_email || "N/A"}</td>
                    <td className="seller-location">{seller.seller_country || "N/A"}</td>
                    <td className="seller-location">{seller.seller_address || "N/A"}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-table btn-approve-table" 
                          onClick={() => handleApproveIndividual(seller)}
                          disabled={actionLoading}
                          title="Approve"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Approve
                        </button>
                        <button 
                          className="btn-table btn-reject-table" 
                          onClick={() => handleRejectIndividual(seller)}
                          disabled={actionLoading}
                          title="Reject"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          Reject
                        </button>
                        <button 
                          className="btn-table btn-suspend-table" 
                          onClick={() => handleSuspendIndividual(seller)}
                          disabled={actionLoading}
                          title="Suspend"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                          Suspend
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* PROFESSIONAL SELLERS WITH COMPANIES */}
      <section className="section-modern">
        <div className="section-header">
          <div className="section-title">
            <div className="icon-wrapper professional">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div>
              <h2>Professional Sellers & Companies</h2>
              <p>{data.professionalSellers.length} pending applications</p>
            </div>
          </div>
        </div>

        {data.professionalSellers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <h3>No pending professional sellers</h3>
            <p>All company applications have been processed</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="sellers-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Seller</th>
                  <th>Location</th>
                  <th>Registration Number</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.professionalSellers.map((item) => (
                  <tr key={item.seller?._id || item.seller?.id}>
                    <td>
                      <div className="seller-name">
                        <div className="seller-avatar-small company-avatar-small">
                          {item.company?.companyBasicInfo?.companyName?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <span>{item.company?.companyBasicInfo?.companyName || "Company Name Missing"}</span>
                      </div>
                    </td>
                    <td className="seller-email">{item.seller?.seller_name || "N/A"}</td>
                    <td className="seller-location">{item.company?.companyBasicInfo?.locationOfRegistration || "N/A"}</td>
                    <td className="seller-location">{item.company?.companyBasicInfo?.company_registration_number || "N/A"}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-table btn-verify-table" 
                          onClick={() => openCompanyModal(item)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                          Verify Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* COMPANY VERIFICATION MODAL */}
      {selectedCompany && (
        <div className="modal-backdrop" onClick={() => setSelectedCompany(null)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <div className="modal-title-section">
                <h2>🔍 Company Verification</h2>
                <p>{selectedCompany.company?.companyBasicInfo?.companyName}</p>
              </div>
              <button className="btn-close-modern" onClick={() => setSelectedCompany(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-toolbar">
              <div className="toolbar-left">
                <button className="btn-tool" onClick={selectAllFields}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Select All
                </button>
                <button className="btn-tool" onClick={deselectAllFields}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  </svg>
                  Clear All
                </button>
              </div>
              <div className="progress-indicator">
                <div className="progress-circle">
                  <svg width="40" height="40">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4"/>
                    <circle 
                      cx="20" 
                      cy="20" 
                      r="18" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 18}`}
                      strokeDashoffset={`${2 * Math.PI * 18 * (1 - getVerifiedCount() / getAllCompanyFields(selectedCompany.company).length)}`}
                      transform="rotate(-90 20 20)"
                    />
                  </svg>
                  <span className="progress-text">{getVerifiedCount()}/{getAllCompanyFields(selectedCompany.company).length}</span>
                </div>
              </div>
            </div>

            <div className="modal-body-modern">
              {Object.entries(getFieldsBySection()).map(([section, fields]) => (
                <div key={section} className="field-section">
                  <h3 className="section-heading">{section}</h3>
                  <div className="fields-grid">
                    {fields.map((field, idx) => (
                      <label key={idx} className="field-checkbox-modern">
                        <input
                          type="checkbox"
                          checked={verifiedFields[field.label] || false}
                          onChange={() => toggleField(field.label)}
                        />
                        <div className="checkbox-custom">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div className="field-info">
                          <span className="field-label">{field.label}</span>
                          <span className="field-value">{field.value}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="rejection-note">
                <label htmlFor="reject-reason">Rejection Message (optional)</label>
                <textarea
                  id="reject-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter a message that will be sent to the seller if rejecting..."
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-footer-modern">
              <button
                className="btn-modal btn-approve-modal"
                onClick={handleApproveCompany}
                disabled={!isAllVerified() || actionLoading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {isAllVerified() ? "Approve Company" : `Verify ${getAllCompanyFields(selectedCompany.company).length - getVerifiedCount()} more fields`}
              </button>
              <button 
                className="btn-modal btn-reject-modal" 
                onClick={handleRejectCompany}
                disabled={actionLoading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Request Corrections
              </button>
              <button 
                className="btn-modal btn-cancel-modal" 
                onClick={() => setSelectedCompany(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;