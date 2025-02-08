export interface TableRow {
    [x: string]: any;
    id: number;
    taskName: string;
    dueDate: string;
    status: string;
    category: string;
    available: string;
    price: string;
    weight: string;
  }
  
  export const tableData: TableRow[] = [
    {
      id: 1,
      taskName: "Interview with Design team",
      dueDate: "01/02/2025",
      status: "TODO",
      category: "Work",
      available: "Yes",
      price: "$2999",
      weight: "3.0 lb.",
    },
    {
      id: 2,
      taskName: "Team Meeting",
      dueDate: "02/02/2025",
      status: "TODO",
      category: "Personal",
      available: "Yes",
      price: "$1999",
      weight: "1.0 lb.",
    },
    {
      id: 3,
      taskName: "Design a Dashboard along with the wireframes",
      dueDate: "03/02/2025",
      status: "TODO",
      category: "Work",
      available: "No",
      price: "$99",
      weight: "0.2 lb.",
    },
    {
      id: 4,
      taskName: "Morning WorkOut",
      dueDate: "01/02/2025",
      status: "In Progress",
      category: "Personal",
      available: "No",
      price: "$99",
      weight: "0.2 lb.",
    },
    {
      id: 5,
      taskName: "Code Review",
      dueDate: "03/02/2025",
      status: "In Progress",
      category: "Work",
      available: "No",
      price: "$99",
      weight: "0.2 lb.",
    },
    {
      id: 6,
      taskName: "Birthday Party",
      dueDate: "01/02/2025",
      status: "Completed",
      category: "Personal",
      available: "No",
      price: "$99",
      weight: "0.2 lb.",
    },
    {
      id: 7,
      taskName: "Birthday Party",
      dueDate: "03/02/2025",
      status: "Completed",
      category: "Personal",
      available: "No",
      price: "$99",
      weight: "0.2 lb.",
    },
  ];