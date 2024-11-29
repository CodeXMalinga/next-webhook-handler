import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for the latest employee number
let latestEmployeeNumber: string = '';

export async function POST(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const serialNumber = searchParams.get('SN');
    const table = searchParams.get('table');
    const stamp = searchParams.get('Stamp');

    // Log the received parameters for debugging
    console.log('Received Parameters:', {
      serialNumber,
      table,
      stamp
    });

    // Read the raw data from the request body
    const rawData = await request.text();
    
    if (!rawData) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Log the raw data for debugging
    console.log('Raw Data:', rawData);

    // Split the data by newline and take the first line
    const firstLine = rawData.split('\n')[0];
    
    // Split the first line by tab
    const columns = firstLine.split('\t');
    
    // Extract the employee number (first column)
    const employeeNumber = columns[0] ? columns[0].trim() : "Invalid Data";
    
    // Update the latest employee number
    latestEmployeeNumber = employeeNumber;
    
    console.log(`Employee Number Received: ${employeeNumber}`);

    // Here you would typically:
    // 1. Validate the employee number in your database
    // 2. Log the attendance
    // 3. Perform any necessary business logic

    return NextResponse.json({ 
      message: "Data received and processed",
      employeeNumber: employeeNumber,
      serialNumber: serialNumber
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing fingerprint device request:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    employeeNumber: latestEmployeeNumber,
    status: "Ready to receive fingerprint data" 
  });
}

// Disable body parsing to handle raw text
export const config = {
  api: {
    bodyParser: false,
  },
};