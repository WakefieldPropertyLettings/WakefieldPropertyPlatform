export const questions = [
  {
    key: "enquiryFor",
    title: "Is this enquiry for yourself?",
    options: ["Yes", "No"],
  },

  // YES path
  {
    key: "livingWith",
    title: "Who will be living in the property?",
    options: [
      "Just Me",
      "Me and My Partner",
      "Me and My Children",
      "Me, My Partner and Children",
      "Me and Pets",
      "Other",
    ],
  },

  // NO path
  {
    key: "otherPerson",
    title: "Who are you making this enquiry for?",
    options: [
      "Brother",
      "Sister",
      "Partner",
      "Friend",
      "Parent",
      "Other Family Member",
      "Support Worker",
      "Employer",
      "Other",
    ],
  },

  {
    key: "employment",
    title: "What is your current employment status?",
    options: [
      "Full-Time Employed",
      "Part-Time Employed",
      "Self-Employed",
      "Company Director",
      "Student",
      "Retired",
      "Currently Not Working",
      "Other",
    ],
  },

  {
    key: "payslips",
    title: "Can you provide six months of payslips if requested?",
    options: ["Yes", "No"],
  },

  {
    key: "bankStatements",
    title: "Can you provide six months of bank statements if requested?",
    options: ["Yes", "No"],
  },

  {
    key: "currentAddress",
    title: "What is your current address?",
  },

  {
    key: "landlordReference",
    title: "Can you provide a reference from your current or previous landlord if requested?",
    options: [
      "Yes",
      "No",
      "Not Applicable",
    ],
  },

  {
    key: "propertyType",
    title: "What type of property are you looking for?",
    options: [
      "Room",
      "Studio",
      "Flat / Apartment",
      "House",
      "No Preference",
    ],
  },


  {
    key: "budget",
    title: "What is your maximum monthly budget (£)?",
  },

  {
    key: "moveDate",
    title: "When would you like to move?",
    options: [
      "Immediately",
      "Within 2 Weeks",
      "Within 1 Month",
      "Within 2 Months",
      "Flexible",
    ],
  },

  {
    key: "benefits",
    title: "Do you currently receive any benefits?",
    options: ["Yes", "No"],
  },

  {
    key: "benefitType",
    title: "Which benefits do you currently receive?",
  },

  {
    key: "immigrationStatus",
    title: "Will you be able to complete the required UK Right to Rent checks before moving into a property?",
    options: [
      "Yes",
      "No",
      "I'm Not Sure",
    ],
  },

  {
    key: "fullName",
    title: "What is your full name?",
  },

  {
    key: "phone",
    title: "What is your mobile number?",
  },

  {
    key: "email",
    title: "What is your email address?",
  },
];