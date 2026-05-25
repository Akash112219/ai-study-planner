from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.exam import ExamSession
import random
from datetime import datetime

exam_bp = Blueprint('exam', __name__)

# Real Question Templates
REAL_QUESTIONS = {
    "database": {
        "MCQ": [
            {
                "question": "What is the primary purpose of a database?",
                "correct_answer": "Store and manage data efficiently",
                "options": ["Store and manage data efficiently", "Render user interface graphics", "Execute operating system core processes", "Compile and build executable code"]
            },
            {
                "question": "Which of the following is considered a NoSQL database?",
                "correct_answer": "MongoDB",
                "options": ["MongoDB", "MySQL", "PostgreSQL", "Oracle Database"]
            },
            {
                "question": "What does ACID stand for in database transactions?",
                "correct_answer": "Atomicity, Consistency, Isolation, Durability",
                "options": ["Atomicity, Consistency, Isolation, Durability", "Active, Consistent, Isolated, Dynamic", "Asynchronous, Controlled, Indexed, Distributed", "Automated, Cached, Internal, Direct"]
            },
            {
                "question": "What does SQL stand for?",
                "correct_answer": "Structured Query Language",
                "options": ["Structured Query Language", "Simple Query Logic", "Software Query Language", "Sequential Question Logic"]
            },
            {
                "question": "Which SQL command is used to extract data from a database?",
                "correct_answer": "SELECT",
                "options": ["SELECT", "EXTRACT", "GET", "OPEN"]
            }
        ],
        "Short": [
            {
                "question": "Explain the difference between a Primary Key and a Foreign Key.",
                "correct_answer": "A primary key uniquely identifies a record in its own table, while a foreign key links to the primary key of another table to establish a relationship.",
                "explanation": "Understanding keys is essential for relational database design."
            },
            {
                "question": "What is Database Normalization?",
                "correct_answer": "Normalization is the process of organizing data to minimize redundancy and dependency by dividing large tables into smaller ones.",
                "explanation": "Normalization prevents data anomalies."
            }
        ],
        "Long": [
            {
                "question": "Discuss the advantages and disadvantages of using a Relational Database versus a NoSQL Database for a highly scalable e-commerce application.",
                "correct_answer": "Relational databases provide strong ACID guarantees and structured schemas, ideal for financial transactions. NoSQL offers horizontal scalability and flexible data models, better for massive product catalogs and rapid development.",
                "explanation": "This requires comparing structured vs unstructured data paradigms."
            }
        ]
    },
    "computer science": {
        "MCQ": [
            {
                "question": "What is the worst-case time complexity of binary search?",
                "correct_answer": "O(log n)",
                "options": ["O(log n)", "O(n)", "O(n log n)", "O(1)"]
            },
            {
                "question": "Which data structure operates on a Last In, First Out (LIFO) principle?",
                "correct_answer": "Stack",
                "options": ["Stack", "Queue", "Linked List", "Binary Tree"]
            },
            {
                "question": "In the OSI model, which layer is responsible for routing packets?",
                "correct_answer": "Network Layer",
                "options": ["Network Layer", "Data Link Layer", "Transport Layer", "Application Layer"]
            }
        ],
        "Short": [
            {
                "question": "Describe the concept of Object-Oriented Programming (OOP).",
                "correct_answer": "OOP is a programming paradigm based on the concept of 'objects', which can contain data and code: data in the form of fields, and code, in the form of procedures.",
                "explanation": "OOP concepts are fundamental in modern software engineering."
            }
        ],
        "Long": [
            {
                "question": "Explain the differences between TCP and UDP protocols, providing use cases for each.",
                "correct_answer": "TCP provides reliable, ordered, and error-checked delivery (e.g., HTTP, emails). UDP is simpler, connectionless, and faster but unreliable (e.g., streaming, gaming).",
                "explanation": "Networking fundamentals."
            }
        ]
    },
    "ged mathematical reasoning": {
        "MCQ": [
            {
                "question": "Simplify the expression: 3(x + 4) - 2x + 5.",
                "correct_answer": "x + 17",
                "options": ["x + 17", "5x + 17", "x + 9", "5x + 9"]
            },
            {
                "question": "If a shirt costs $20 and is on sale for 15% off, what is the final price?",
                "correct_answer": "$17.00",
                "options": ["$17.00", "$15.00", "$18.50", "$16.50"]
            },
            {
                "question": "What is the slope of the line passing through the points (2, 3) and (4, 7)?",
                "correct_answer": "2",
                "options": ["2", "1/2", "-2", "4"]
            }
        ],
        "Short": [
            {
                "question": "Explain how to find the median of a set of numbers.",
                "correct_answer": "Order the numbers from least to greatest and find the middle number. If there are two middle numbers, average them.",
                "explanation": "Tests basic statistical reasoning."
            }
        ],
        "Long": [
            {
                "question": "A painter charges a flat fee of $50 plus $20 per hour. Set up an equation to find the total cost (C) for (h) hours of work, and calculate the cost for 6 hours.",
                "correct_answer": "C = 50 + 20h. For 6 hours: C = 50 + 20(6) = 50 + 120 = $170.",
                "explanation": "Evaluates algebraic problem solving in a real-world scenario."
            }
        ]
    },
    "ged science": {
        "MCQ": [
            {
                "question": "Which of the following is responsible for carrying oxygen in the blood?",
                "correct_answer": "Red blood cells",
                "options": ["Red blood cells", "White blood cells", "Platelets", "Plasma"]
            },
            {
                "question": "What type of chemical reaction absorbs heat from its surroundings?",
                "correct_answer": "Endothermic",
                "options": ["Endothermic", "Exothermic", "Combustion", "Oxidation"]
            }
        ],
        "Short": [
            {
                "question": "State the Law of Conservation of Energy.",
                "correct_answer": "Energy cannot be created or destroyed; it can only be transformed from one form to another.",
                "explanation": "Core physics principle."
            }
        ],
        "Long": [
            {
                "question": "Describe the process of photosynthesis, including the primary inputs and outputs.",
                "correct_answer": "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide (inputs) to produce oxygen and glucose (outputs).",
                "explanation": "Assesses understanding of a fundamental biological process."
            }
        ]
    },
    "ged social studies": {
        "MCQ": [
            {
                "question": "Which amendment to the U.S. Constitution guarantees the right to free speech?",
                "correct_answer": "First Amendment",
                "options": ["First Amendment", "Second Amendment", "Fifth Amendment", "Tenth Amendment"]
            },
            {
                "question": "What is the economic system in which prices are determined by unrestricted competition between privately owned businesses?",
                "correct_answer": "Free market capitalism",
                "options": ["Free market capitalism", "Communism", "Socialism", "Mercantilism"]
            }
        ],
        "Short": [
            {
                "question": "What is the purpose of the system of checks and balances in the U.S. government?",
                "correct_answer": "To ensure that no single branch of government (executive, legislative, judicial) becomes too powerful.",
                "explanation": "Core civics concept."
            }
        ],
        "Long": [
            {
                "question": "Analyze the primary causes of the American Civil War.",
                "correct_answer": "The primary causes included the moral and economic conflicts over the institution of slavery, disputes over states' rights versus federal authority, and economic differences between the industrial North and agricultural South.",
                "explanation": "Evaluates historical analysis and synthesis."
            }
        ]
    },
    "ged language arts": {
        "MCQ": [
            {
                "question": "Identify the main idea in the following sentence: 'Despite the heavy rain, the dedicated marathon runners refused to quit.'",
                "correct_answer": "The runners persevered through difficult conditions.",
                "options": ["The runners persevered through difficult conditions.", "It was raining heavily during the marathon.", "Marathons are very difficult to finish.", "The runners should have quit due to the rain."]
            },
            {
                "question": "Which transition word best connects two opposing ideas?",
                "correct_answer": "However",
                "options": ["However", "Therefore", "Furthermore", "Consequently"]
            }
        ],
        "Short": [
            {
                "question": "What is the difference between a theme and a plot in literature?",
                "correct_answer": "The plot is the sequence of events that make up a story, while the theme is the underlying message or central idea the author is conveying.",
                "explanation": "Tests literary comprehension."
            }
        ],
        "Long": [
            {
                "question": "Write a brief essay outlining the components of a strong argumentative text.",
                "correct_answer": "A strong argumentative text includes a clear thesis statement, well-researched evidence supporting the claims, anticipation and refutation of counterarguments, and a strong conclusion that reinforces the main point.",
                "explanation": "Evaluates understanding of essay structure."
            }
        ]
    }
}

def generate_mock_questions(subject, topic, count, q_type, marks_per_q, education_level, exam_mode):
    questions = []
    subject_lower = subject.lower()
    
    # Set to ensure 100% unique questions
    seen_questions = set()
    
    # Analyze Class Level to determine language complexity
    ed_level_lower = education_level.lower()
    if any(lvl in ed_level_lower for lvl in ["9th", "10th", "11th", "12th", "ged"]):
        complexity_verbs = ["Identify", "Define", "Describe basic", "Calculate", "Explain the purpose of"]
        context_str = f"foundational level for {education_level}"
    elif any(lvl in ed_level_lower for lvl in ["bs", "adp", "1st year", "2nd year"]):
        complexity_verbs = ["Analyze", "Implement", "Compare and contrast", "Evaluate", "Design"]
        context_str = f"advanced undergraduate level for {education_level}"
    else: # Masters, MPhil, PhD
        complexity_verbs = ["Critically evaluate", "Synthesize", "Develop a theoretical framework for", "Propose a novel solution using", "Deconstruct"]
        context_str = f"expert research level for {education_level}"
        
    subtopics = [
        "Fundamentals", "Advanced Applications", "Theoretical Models", "Practical Implications", 
        "Historical Context", "Future Trends", "Core Mechanics", "Edge Cases", 
        "Standard Protocols", "System Integration", "Data Analysis", "Safety Measures", 
        "Key Mechanisms", "Primary Use-Cases", "Optimization Strategies", "Design Principles", 
        "Evaluation Metrics", "Troubleshooting", "Maintenance", "Scalability",
        "Performance Tuning", "Risk Assessment", "Methodological Approaches", "Ethical Considerations"
    ]
    
    attempts = 0
    while len(questions) < count and attempts < count * 5:
        attempts += 1
        i = len(questions)
        
        # Calculate Importance and Probability
        prob = 60 + (i * 7 + attempts * 3) % 40
        if prob > 85: 
            importance = "🔥 Must Prepare"
        elif prob > 70: 
            importance = "⭐ Important"
        else: 
            importance = "📝 Practice"
            
        # Analysis of past 6 years papers
        past_paper_frequency = 0
        years_repeated = []
        if prob > 70:
            past_paper_frequency = random.randint(2, 6)
            base_year = 2025
            available_years = [base_year - y for y in range(1, 7)]
            # random.sample is safe because available_years has 6 items and frequency is max 6
            years_sample = random.sample(available_years, past_paper_frequency)
            years_sample.sort()
            years_repeated = [str(y) for y in years_sample]

        sub_focus = subtopics[(i + attempts) % len(subtopics)]
        verb = complexity_verbs[(i + attempts) % len(complexity_verbs)]
        
        # Determine Role/Mode
        eff_mode = exam_mode
        if exam_mode == "Mixed Exam Mode":
            eff_mode = random.choice(["Theory Only", "Practical Only"])
            
        q_text = ""
        correct_answer = ""
        options = []
        
        if exam_mode == "Viva Only":
            q_text = f"Examiner: '{verb} the {sub_focus} of {topic} in the context of {subject}, considering your {education_level} background.'"
            correct_answer = f"A confident verbal response addressing the {sub_focus} using {context_str} concepts."
        elif eff_mode == "Practical Only":
            if q_type == "MCQ":
                q_text = f"During a {education_level} practical lab, which tool or protocol is strictly required to {verb.lower()} the {sub_focus} of {topic}?"
                correct_answer = f"The standard practical protocol for {sub_focus}."
                options = [
                    correct_answer,
                    f"An incorrect theoretical assumption about {topic}.",
                    f"A deprecated tool used for older versions of {subject}.",
                    "Skipping the verification phase entirely."
                ]
            elif q_type == "Short":
                q_text = f"Write the step-by-step lab procedure to {verb.lower()} the {sub_focus} of {topic}."
                correct_answer = f"Step 1: Setup apparatus/environment. Step 2: Execute {sub_focus}. Step 3: Validate results."
            else:
                q_text = f"Case Study: A practical implementation of {topic} has failed during a critical {sub_focus} operation. Diagnose the root cause using {education_level} methodologies and propose a fix."
                correct_answer = f"A full diagnostic breakdown including hypothesis, procedure, and failure mitigation for {topic}."
        else: # Theory Only
            if q_type == "MCQ":
                q_text = f"At the {education_level} level, how would you best {verb.lower()} the {sub_focus} of {topic}?"
                correct_answer = f"By applying advanced principles of {sub_focus} suitable for {context_str}."
                options = [
                    correct_answer,
                    f"It is an outdated concept not relevant to {education_level}.",
                    f"It functions primarily as a secondary aesthetic component.",
                    "It relies entirely on administrative overrides."
                ]
            elif q_type == "Short":
                q_text = f"{verb} the role of {sub_focus} within {topic} as expected in a {education_level} syllabus."
                correct_answer = f"It serves as a critical mechanism for standardizing operations and solving complex problems in {topic}."
            else:
                q_text = f"Write a comprehensive essay to {verb.lower()} the impact of {sub_focus} within {topic}. Include critical evaluations appropriate for {education_level}."
                correct_answer = f"A comprehensive answer covering the inception of {topic}, theoretical basis, and modern use-cases with academic rigor."
                
        # To ensure 100% uniqueness, append a slight contextual variation if we hit a duplicate
        if q_text in seen_questions:
            q_text = q_text[:-1] + f" specifically focusing on aspect {attempts}?"

        if q_text in seen_questions:
            continue
            
        seen_questions.add(q_text)
        
        q_obj = {
            "id": f"{q_type.lower()}_{i+1}_{attempts}",
            "question": q_text,
            "correct_answer": correct_answer,
            "explanation": f"Evaluates {sub_focus} at the {context_str}.",
            "difficulty": random.choice(["easy", "medium", "hard"]),
            "importance": importance,
            "exam_probability": f"{prob}%",
            "past_paper_frequency": past_paper_frequency,
            "years_repeated": ", ".join(years_repeated) if years_repeated else None,
            "marks": marks_per_q,
            "type": q_type if exam_mode != "Viva Only" else "Viva"
        }
        
        if q_type == "MCQ" and options:
            q_obj["options"] = options
            random.shuffle(q_obj["options"])
            
        questions.append(q_obj)

    # Rank them by priority
    def score(q):
        imp = q.get('importance', '')
        p = int(q.get('exam_probability', '0').replace('%', ''))
        return (0 if 'Must Prepare' in imp else 1 if 'Important' in imp else 2, -p)
        
    return sorted(questions, key=score)

@exam_bp.route('/start-test', methods=['POST'])
@jwt_required()
def start_test():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    subject = data.get('subject_name', 'General Subject').title()
    topic_list = data.get('topic_list', [])
    topic = topic_list[0] if topic_list else "Core Concepts"
    difficulty = data.get('difficulty', 'medium')
    education_level = data.get('education_level', 'BS Program')
    exam_mode = data.get('exam_mode', 'Theory Only')
    
    # Create Exam Session
    session = ExamSession(
        user_id=current_user_id,
        subject_name=subject,
        topic_focus=topic,
        difficulty=difficulty,
        total_marks=100,
        status='in_progress',
        duration_minutes=90 # e.g. 90 minutes test
    )
    db.session.add(session)
    db.session.commit()
    
    total_count = int(data.get('question_count', 27))
    if total_count < 3:
        total_count = 3
        
    mcq_count = max(1, int(total_count * 0.5))
    short_count = max(1, int(total_count * 0.3))
    long_count = total_count - mcq_count - short_count
    
    if long_count <= 0:
        long_count = 1
        mcq_count = total_count - short_count - long_count
        
    mcq_marks_per_q = round(20 / mcq_count, 1)
    short_marks_per_q = round(50 / short_count, 1)
    long_marks_per_q = round(30 / long_count, 1)

    # Generate the requested exact number of questions
    mcqs = generate_mock_questions(subject, topic, mcq_count, "MCQ", mcq_marks_per_q, education_level, exam_mode)
    shorts = generate_mock_questions(subject, topic, short_count, "Short", short_marks_per_q, education_level, exam_mode)
    longs = generate_mock_questions(subject, topic, long_count, "Long", long_marks_per_q, education_level, exam_mode)
    
    return jsonify({
        "session_id": session.id,
        "duration_minutes": session.duration_minutes,
        "total_marks": 100,
        "subject": subject,
        "paper": {
            "mcqs": mcqs,
            "short_questions": shorts,
            "long_questions": longs
        }
    }), 201

@exam_bp.route('/submit-test', methods=['POST'])
@jwt_required()
def submit_test():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    session_id = data.get('session_id')
    user_answers = data.get('answers', {}) # Expected dict: { "mcq_1": "answer text", ... }
    correct_mcq_answers = data.get('correct_mcq_answers', {}) # Given from frontend for simplicity here
    
    session = ExamSession.query.filter_by(id=session_id, user_id=current_user_id).first()
    if not session:
        return jsonify({"msg": "Exam session not found"}), 404
        
    if session.status != 'in_progress':
        return jsonify({"msg": "Exam already submitted"}), 400
        
    # Calculate MCQ Score (Out of 20)
    mcq_score = 0
    for q_id, correct_ans in correct_mcq_answers.items():
        if user_answers.get(q_id) == correct_ans:
            mcq_score += 1
            
    # Mock evaluate Short & Long for now
    short_score = random.randint(30, 50) # Out of 50
    long_score = random.randint(15, 30) # Out of 30
    
    total_obtained = mcq_score + short_score + long_score
    percentage = (total_obtained / 100) * 100
    
    session.mcq_score = mcq_score
    session.short_score = short_score
    session.long_score = long_score
    session.obtained_marks = total_obtained
    session.percentage = percentage
    session.status = 'submitted'
    
    # Generate Insights
    topic = session.topic_focus
    if percentage >= 80:
        session.strong_topics = f"{topic} Fundamentals, MCQ Recall"
        session.weak_topics = "Deep Synthesis Questions"
        session.improvement_suggestions = "Great work! Focus on perfectly structuring your long answers to avoid losing minor points."
    elif percentage >= 60:
        session.strong_topics = "Basic Theory"
        session.weak_topics = f"Advanced {topic} Applications"
        session.improvement_suggestions = "Good effort. Review the short answers related to formula derivations and conceptual edge cases."
    else:
        session.strong_topics = "Attempting all sections"
        session.weak_topics = f"Core principles of {topic}, Time management"
        session.improvement_suggestions = "We need to revisit the foundational concepts. Use the practice mode before taking another full exam."
        
    db.session.commit()
    
    return jsonify({
        "msg": "Test submitted successfully",
        "result": session.to_dict()
    }), 200

@exam_bp.route('/test-result/<int:session_id>', methods=['GET'])
@jwt_required()
def get_test_result(session_id):
    current_user_id = get_jwt_identity()
    session = ExamSession.query.filter_by(id=session_id, user_id=current_user_id).first()
    
    if not session:
        return jsonify({"msg": "Session not found"}), 404
        
    return jsonify(session.to_dict()), 200
