---
layout: post
title: As-many-days-together-as-not Calculator
date: 2022-01-25 10:09:00
description: Calculate the date when you have been with your significant other longer than you have not!
tags: misc
thumbnail: assets/img/calculator.png
related_posts: true
giscus_comments: true
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Milestone Date Calculator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        label {
            display: block;
            margin-top: 10px;
        }
        input {
            margin-top: 5px;
            padding: 5px;
            width: 100%;
        }
        button {
            margin-top: 15px;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        .result {
            margin-top: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <p>Enter your date of birth and the date you started dating your significant other to find out the date when you'll have been with them longer than not with them.</p>
    <form id="calculatorForm">
        <label for="dob">Date of Birth:</label>
        <input type="date" id="dob" required>
        
        <label for="startDate">Date You Started Dating:</label>
        <input type="date" id="startDate" required>
        
        <button type="button" onclick="calculateMilestone()">Calculate</button>
    </form>
    <div class="result" id="result"></div>

    <script>
        function calculateMilestone() {
            const dob = new Date(document.getElementById('dob').value);
            const startDate = new Date(document.getElementById('startDate').value);

            if (isNaN(dob) || isNaN(startDate)) {
                document.getElementById('result').textContent = "Please enter valid dates.";
                return;
            }

            const timeBetween = startDate - dob; // Difference in milliseconds
            const milestoneDate = new Date(startDate.getTime() + timeBetween); // Add the difference to the start date

            const milestoneDateFormatted = milestoneDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            document.getElementById('result').textContent = `You will have been with your partner longer than not on: ${milestoneDateFormatted}`;
        }
    </script>

</body>
</html>
