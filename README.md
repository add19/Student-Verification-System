Student verification is a request for a university/college to verify a student’s degree and
enrollment information. Students may need it to defer student loans, health insurance, to verify degrees for
prospective employers, etc. A transcript is a comprehensive record of academic information that includes
coursework, grades, credit hours, CPI and degrees earned. Students would request an official transcript
when they are transferring to another institution, applying to graduate school, applying for an internship or
applying for a scholarship.
Generally, companies ask for a student’s verification via the college’s portal. As well as
students also request for the transcript via the same portal. The college has to manually check the grades
of the students and the portal states that it might take up to 7 days to complete the request, which might
cause missing of important deadlines, besides there is also a chance of human error.
So the project proposes an automated system to tackle these problems and complete the
request in less time with greater reliability. The project proposes an implementation of a Merkle tree based
private blockchain in a distributed environment. To reach the consensus in this distributed system the
project uses practical Byzantine Fault Tolerance(pBFT) mechanism. Consistency and availability along
with scalability and security of the system is ensured by this approach.
The verifying party requests for validation of a particular student by entering the required
information on the portal. The information would be hashed and sent to the college’s server, this server
would perform a Merkle proof to validate that the hash and check if that hash is present in the system. Once
the hash is validated, the verifying party gets the result as the student is validated along with the image of
the original grade card for further inspection.
The project also proposes a cross-validation system for the transcript generation. The
student requesting the transcript has to fill the same information as that of the verifying party along with
his/her email address. The data is again hashed and validated via the Merkle proof. And then only the
transcript is generated and mailed to the concerned student.
