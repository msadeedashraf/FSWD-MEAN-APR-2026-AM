/*

<div class="job-listing">
                  

  <h3>Software Engineer</h3>
                    <p>CBC</p>
                    <p>New York, NY</p>
                    <p> We are looking for a skilled and experienced Software Developer to
                        join our team. The ideal candidate should have strong programming
                        skills in Java and experience with web development technologies
                        such as HTML, CSS, and JavaScript. Familiarity with databases and
                        version control systems is a plus.</p>
                    <p class="learn-more"><a href="#">Learn More</a></p>
                </div>

*/

//console.log(alert("Page testing"));
/*
fetch("/projects/jobzila/data/jobs.json") //// Replace with your actual JSON file or API endpoint URL
  .then((response) => response.json())
  .then((data) => {
    console.log(data); //testing to see if the data is pickedup from json file or not
  })
  .catch((error) =>
    console.error("Error fetching json data, please check your path", error)
  );
*/

/*
fetch("url")
.then(()=>())
.then(()=>())
.catch(()=>())
*/

fetch("data/jobs.json") //// Replace with your actual JSON file or API endpoint URL
  .then((response) => response.json())
  .then((data) => {
    let myAllJobs = document.getElementById("job-listing-container");

    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
      let jobListing = data[i];

      //let jobListingItem = document.createElement("div");
      //jobListingItem.classList.add("job-listing");

      let jobListingItem = document.createElement("div");

      jobListingItem.classList.add("job-listing");

      jobListingItem.innerHTML = `<h3>${jobListing.title}</h3>
      <p>${jobListing.company}</p>
      <p>${jobListing.location}</p>
      <p>${jobListing.description}</p>`;

      myAllJobs.appendChild(jobListingItem);
    }
  });
