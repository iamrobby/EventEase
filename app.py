import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
from google import genai

# from google.api_core.exceptions import TooManyRequests
import time
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib import colors
from PyPDF2 import PdfReader, PdfWriter
import io, os, zipfile

genai.configure(api_key="AIzaSyDF6W5I0TMHDxit-IA519FvknKyQKMiHZU")

model = genai.GenerativeModel("models/gemini-2.5-flash")

st.title("Hello from Colab!")
st.write("This is a Streamlit app running inside Google Colab.")

# Initialize session state variables if they don't exist
if "report_generated" not in st.session_state:
    st.session_state.report_generated = False
if "ai_report" not in st.session_state:
    st.session_state.ai_report = ""
if "registered_data" not in st.session_state:
    st.session_state.registered_data = None
if "present_data" not in st.session_state:
    st.session_state.present_data = None
if "merged_data" not in st.session_state:
    st.session_state.merged_data = None
if "dept_counts" not in st.session_state:
    st.session_state.dept_counts = None
if "total_registered" not in st.session_state:
    st.session_state.total_registered = 0
if "total_present" not in st.session_state:
    st.session_state.total_present = 0
if "total_absent" not in st.session_state:
    st.session_state.total_absent = 0
if "event_stats" not in st.session_state:
    st.session_state.event_stats = None
if "certificates_generated" not in st.session_state:
    st.session_state.certificates_generated = False


with st.form("attendance_form"):
    st.markdown("### Upload Attendance Files")

    registered_file = st.file_uploader(
        "Registered Students CSV", type=["csv"], key="registered_uploader"
    )
    present_file = st.file_uploader(
        "Present Students CSV", type=["csv"], key="present_uploader"
    )

    submit = st.form_submit_button("Analyze Attendance")

if submit and registered_file and present_file:
    st.session_state.registered_data = pd.read_csv(registered_file)
    st.session_state.present_data = pd.read_csv(present_file)

    # Validate presence
    present_valid = st.session_state.present_data[
        st.session_state.present_data["student_id"].isin(st.session_state.registered_data["student_id"])
    ]

    st.session_state.merged_data = st.session_state.registered_data.merge(
        present_valid, on="student_id", how="left"
    )

    st.session_state.merged_data["status"] = st.session_state.merged_data["scan_time"].apply(
        lambda x: "Present" if pd.notna(x) else "Absent"
    )

    st.success("Attendance processed successfully")

    st.session_state.total_registered = len(st.session_state.registered_data)
    st.session_state.total_present = (st.session_state.merged_data["status"] == "Present").sum()
    st.session_state.total_absent = (st.session_state.merged_data["status"] == "Absent").sum()

    st.session_state.dept_counts = (
        st.session_state.merged_data.groupby(["department", "status"])
        .size()
        .unstack(fill_value=0)
    )

    st.session_state.event_stats = {
        "total_registered": int(st.session_state.total_registered),
        "total_present": int(st.session_state.total_present),
        "total_absent": int(st.session_state.total_absent),
        "department_wise": st.session_state.dept_counts.to_dict()
    }

# Display results if data is available in session state
if st.session_state.merged_data is not None:
    st.markdown("### Student Attendance Record")
    st.dataframe(st.session_state.merged_data, width='stretch')

    col1, col2, col3 = st.columns(3)
    col1.metric("Registered", st.session_state.total_registered)
    col2.metric("Present", st.session_state.total_present)
    col3.metric("Absent", st.session_state.total_absent)

    st.markdown("### Department-wise Attendance")
    st.dataframe(st.session_state.dept_counts)

    fig, ax = plt.subplots()
    st.session_state.dept_counts.plot(kind="bar", stacked=True, ax=ax)
    ax.set_xlabel("Department")
    ax.set_ylabel("Students")
    ax.set_title("Department-wise Attendance")
    st.pyplot(fig)

    if model:
        st.markdown("### AI-Report For your Event")

        if st.button("Generate Report"):
            st.session_state.report_generated = True
            with st.spinner("Generating insights..."):
                prompt = f"""
You are the official Report Editor and you are generating an official post-event attendance analysis report
for an academic event organizer.

You are given verified attendance statistics.
DO NOT invent numbers.
DO NOT repeat raw data tables.

Event Statistics:
- Total registered students: {st.session_state.event_stats['total_registered']}
- Total present students: {st.session_state.event_stats['total_present']}
- Total absent students: {st.session_state.event_stats['total_absent']}

Department-wise attendance:
{st.session_state.event_stats['department_wise']}

Write a structured, professional report including:
1. Overall participation quality
2. Department-wise participation trends
3. Attendance gaps
4. Possible reasons for absence (reasonable assumptions only)
5. Actionable suggestions for future events

Tone:
Formal, academic, concise.
"""
                try:
                    response = model.generate_content(prompt)
                    st.session_state.ai_report = response.text
                except TooManyRequests:
                    st.error("Rate limit exceeded. Try again later.")

        if st.session_state.report_generated:
           st.markdown("#### Generated Report")
           st.write(st.session_state.ai_report)
    else:
        st.warning("Enter Gemini API key to enable AI insights")

TEMPLATE_FILE = "Tech_Workshop_Certificate_Template.pdf"

def create_certificate_template():
    if os.path.exists(TEMPLATE_FILE):
        return

    c = canvas.Canvas(TEMPLATE_FILE, pagesize=landscape(A4))
    width, height = landscape(A4)

    c.setStrokeColor(colors.navy)
    c.setLineWidth(3)
    c.rect(10*mm, 10*mm, width-20*mm, height-20*mm)

    c.setLineWidth(1)
    c.rect(12*mm, 12*mm, width-24*mm, height-24*mm)

    center_x = width / 2

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(colors.navy)
    c.drawCentredString(center_x, height - 60*mm, "CERTIFICATE OF PARTICIPATION")

    c.setFont("Times-Roman", 18)
    c.setFillColor(colors.black)
    c.drawCentredString(center_x, height - 85*mm, "This is to certify that")

    c.setFont("Times-Roman", 18)
    c.drawCentredString(center_x, height - 135*mm,
        "has successfully participated in the AI Awareness Workshop")
    c.setFont("Times-Bold", 18)
    c.drawCentredString(center_x, height - 160*mm,
        "organized by Tech Club on 31 December 2025.")

    footer_y = 30*mm
    c.line(40*mm, footer_y+10*mm, 90*mm, footer_y+10*mm)
    c.setFont("Helvetica", 12)
    c.drawString(40*mm, footer_y, "Organizer Signature")

    c.circle(width-65*mm, footer_y+10*mm, 20*mm)
    c.drawCentredString(width-65*mm, footer_y, "Official Seal")

    c.save()

def generate_certificate(name, output_path):
    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=landscape(A4))
    width, height = landscape(A4)

    c.setFont("Times-Bold", 28)
    c.drawCentredString(width/2, height - 115*mm, name)
    c.save()

    packet.seek(0)
    overlay = PdfReader(packet)
    template = PdfReader(TEMPLATE_FILE)

    writer = PdfWriter()
    page = template.pages[0]
    page.merge_page(overlay.pages[0])
    writer.add_page(page)

    with open(output_path, "wb") as f:
        writer.write(f)

def bulk_generate_certificates(df):
    output_dir = "generated_certificates"
    os.makedirs(output_dir, exist_ok=True)

    for _, row in df.iterrows():
        name = row["name"]
        safe_name = name.replace(" ", "_")
        generate_certificate(name, f"{output_dir}/{safe_name}.pdf")

    return output_dir

def zip_certificates(folder):
    zip_path = f"{folder}/certificates.zip"
    with zipfile.ZipFile(zip_path, "w") as z:
        for f in os.listdir(folder):
            if f.endswith(".pdf"):
                z.write(os.path.join(folder, f), arcname=f)
    return zip_path

st.markdown("### Certificate Generation")

if not st.session_state.certificates_generated:
            if st.button("Generate Certificates"):
                with st.spinner("Creating certificates..."):
                    create_certificate_template()
                    present_df = st.session_state.merged_data[st.session_state.merged_data["status"] == "Present"]
                    folder = bulk_generate_certificates(present_df)
                    st.session_state.certificate_dir = folder
                    st.session_state.certificates_generated = True
                st.success("Certificates generated")

if st.session_state.certificates_generated:
            zip_path = zip_certificates(st.session_state.certificate_dir)

            with open(zip_path, "rb") as f:
                st.download_button(
                    "Download All Certificates (ZIP)",
                    f,
                    file_name="Certificates.zip",
                    mime="application/zip"
                )
