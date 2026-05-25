from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

questions_bp = Blueprint('questions', __name__)

# Predefined dataset of questions for common subjects
MOCK_QUESTION_BANK = {
    "math": {
        "algebra": [
            {
                "question": "Solve for x: 2x + 5 = 15", 
                "difficulty": "easy",
                "previous_appearances": 3,
                "answer": "Subtract 5 from both sides to get 2x = 10, then divide by 2 to find x = 5.",
                "preparation_tip": "Practice basic linear equations focusing on isolating variables."
            },
            {
                "question": "Find the roots of the quadratic equation: x^2 - 5x + 6 = 0", 
                "difficulty": "medium",
                "previous_appearances": 5,
                "answer": "Factor the equation to (x-2)(x-3) = 0. The roots are x = 2 and x = 3.",
                "preparation_tip": "Review factoring techniques and the quadratic formula."
            },
            {
                "question": "Solve the system of equations: 3x+y=9 and 2x-y=1", 
                "difficulty": "hard",
                "previous_appearances": 1,
                "answer": "Add the two equations to eliminate y: (3x+2x) = 10, so 5x = 10, x = 2. Substitute x back to get y = 3.",
                "preparation_tip": "Master the elimination and substitution methods for systems."
            }
        ],
        "calculus": [
            {
                "question": "What is the derivative of x^2?", 
                "difficulty": "easy",
                "previous_appearances": 4,
                "answer": "Using the power rule (nx^(n-1)), the derivative is 2x.",
                "preparation_tip": "Memorize standard derivative rules like the power rule."
            },
            {
                "question": "Find the integral of 1/x dx.", 
                "difficulty": "medium",
                "previous_appearances": 2,
                "answer": "The integral of 1/x dx is ln|x| + C.",
                "preparation_tip": "Review common standard integrals and log properties."
            },
            {
                "question": "Evaluate the limit of (sin x)/x as x approaches 0.", 
                "difficulty": "hard",
                "previous_appearances": 3,
                "answer": "Using L'Hopital's rule or known trigonometric limits, the answer is 1.",
                "preparation_tip": "Practice applying L'Hopital's rule for indeterminate forms."
            }
        ]
    },
    "physics": {
        "mechanics": [
            {
                "question": "What is Newton's Second Law of Motion?", 
                "difficulty": "easy",
                "previous_appearances": 6,
                "answer": "Force equals mass times acceleration (F = ma).",
                "preparation_tip": "Focus on free body diagrams and basic force calculations."
            },
            {
                "question": "Calculate the kinetic energy of a 2kg object moving at 5m/s.", 
                "difficulty": "medium",
                "previous_appearances": 2,
                "answer": "KE = 0.5 * m * v^2. Therefore, KE = 0.5 * 2 * 25 = 25 Joules.",
                "preparation_tip": "Understand the energy equations and units of measurement."
            },
            {
                "question": "Derive the equation for the period of a simple pendulum.", 
                "difficulty": "hard",
                "previous_appearances": 1,
                "answer": "Start with restoring force F = -mg sin(theta), approximate sin(theta) to theta, resulting in T = 2 * pi * sqrt(L/g).",
                "preparation_tip": "Review simple harmonic motion derivations."
            }
        ],
        "thermodynamics": [
            {
                "question": "Define the First Law of Thermodynamics.", 
                "difficulty": "easy",
                "previous_appearances": 5,
                "answer": "Energy cannot be created or destroyed, only transformed (Delta U = Q - W).",
                "preparation_tip": "Memorize definitions and sign conventions for heat and work."
            },
            {
                "question": "What is an adiabatic process?", 
                "difficulty": "medium",
                "previous_appearances": 3,
                "answer": "A process where no heat is transferred into or out of the system (Q = 0).",
                "preparation_tip": "Study standard P-V diagrams for different thermodynamic processes."
            },
            {
                "question": "Calculate the efficiency of a Carnot engine operating between 500K and 300K.", 
                "difficulty": "hard",
                "previous_appearances": 2,
                "answer": "Efficiency = 1 - (Tc/Th) = 1 - (300/500) = 0.4 or 40%.",
                "preparation_tip": "Practice calculating ideal efficiencies using Kelvin temperatures."
            }
        ]
    },
    "history": {
        "world war 2": [
            {
                "question": "In what year did World War 2 begin?", 
                "difficulty": "easy",
                "previous_appearances": 8,
                "answer": "1939, following the invasion of Poland by Germany.",
                "preparation_tip": "Create a timeline of major trigger events."
            },
            {
                "question": "Describe the significance of the Battle of Stalingrad.", 
                "difficulty": "medium",
                "previous_appearances": 4,
                "answer": "It marked a turning point in the war, halting the German advance into the Soviet Union.",
                "preparation_tip": "Review key turning point battles and their geopolitical impacts."
            },
            {
                "question": "Analyze the political consequences of the Yalta Conference.", 
                "difficulty": "hard",
                "previous_appearances": 3,
                "answer": "It essentially divided Germany into occupation zones and set the stage for the Cold War.",
                "preparation_tip": "Focus on post-war agreements and ideological shifts."
            }
        ]
    }
}

@questions_bp.route('/important-questions', methods=['POST'])
@jwt_required()
def generate_questions():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No input data provided"}), 400
        
    subject = data.get('subject_name', '').lower().strip()
    topic_list = data.get('topic_list', [])
    req_difficulty = data.get('difficulty', 'all').lower()
    num_questions = int(data.get('number_of_questions', 10))
    
    if not subject:
        return jsonify({"msg": "subject_name is required"}), 400
        
    results = []
    
    # Check predefined dataset
    if subject in MOCK_QUESTION_BANK:
        bank = MOCK_QUESTION_BANK[subject]
        
        if not topic_list:
            # If no topics specified, return one from each available topic
            for topic, questions in bank.items():
                results.extend(questions)
        else:
            for t in topic_list:
                t_lower = t.lower().strip()
                if t_lower in bank:
                    results.extend(bank[t_lower])
                else:
                    # Fallback rule-based generation for specific topic in known subject
                    results.extend([
                        {
                            "question": f"What are the fundamental principles of {t} in {subject.title()}?", 
                            "difficulty": "medium",
                            "previous_appearances": 2,
                            "answer": "Review standard definitions and core axioms in the textbook.",
                            "preparation_tip": "Focus on understanding foundational concepts before attempting complex problems."
                        },
                        {
                            "question": f"Analyze an advanced problem involving {t}.", 
                            "difficulty": "hard",
                            "previous_appearances": 1,
                            "answer": "Apply multiple formulas or historical contexts to formulate a comprehensive answer.",
                            "preparation_tip": "Practice synthesizing information from multiple chapters."
                        }
                    ])
    else:
        # Rule-based fallback generation for unknown subjects
        if not topic_list:
            topic_list = ["Core Concepts", "Advanced Applications"]
            
        for t in topic_list:
            results.extend([
                {
                    "question": f"Define the basic terms related to {t}.", 
                    "difficulty": "easy",
                    "previous_appearances": 3,
                    "answer": "A straightforward recall of terms. Check your glossary.",
                    "preparation_tip": "Create flashcards for essential vocabulary."
                },
                {
                    "question": f"Explain the key mechanisms of {t} in the context of {subject.title()}.", 
                    "difficulty": "medium",
                    "previous_appearances": 2,
                    "answer": "Describe the step-by-step process or logic tying the concept together.",
                    "preparation_tip": "Draw diagrams or mind-maps to visualize connections."
                },
                {
                    "question": f"Evaluate a complex real-world scenario applying {t}.", 
                    "difficulty": "hard",
                    "previous_appearances": 1,
                    "answer": "Provide a critical analysis weighing pros and cons or solving a multi-step equation.",
                    "preparation_tip": "Review case studies and practice applying theories to new contexts."
                }
            ])
            
    # Remove exact duplicates if any
    unique_results = []
    seen = set()
    for r in results:
        if r['question'] not in seen:
            seen.add(r['question'])
            unique_results.append(r)
            
    # Filter by difficulty
    if req_difficulty and req_difficulty != 'all':
        unique_results = [r for r in unique_results if r['difficulty'] == req_difficulty]
            
    # Inject new required fields dynamically if not present
    for r in unique_results:
        if 'explanation' not in r:
            r['explanation'] = "This concept bridges basic theory with practical application, heavily testing your comprehensive understanding."
            
        if 'importance_level' not in r:
            if r['difficulty'] == 'easy':
                r['importance_level'] = '📝 Practice'
            elif r['difficulty'] == 'hard':
                r['importance_level'] = '🔥 Must Prepare'
            else:
                r['importance_level'] = '⭐ Important'
                
        if 'exam_probability' not in r:
            base_prob = 65
            prev_app = r.get('previous_appearances', 1)
            base_prob += min(30, prev_app * 6)
            r['exam_probability'] = f"{base_prob}%"

    # Sort roughly by difficulty (easy -> hard) or importance
    diff_order = {"easy": 1, "medium": 2, "hard": 3}
    unique_results.sort(key=lambda x: diff_order.get(x['difficulty'], 2))

    return jsonify({
        "subject": subject.title(),
        "topics_analyzed": topic_list,
        "questions": unique_results[:num_questions]
    }), 200

@questions_bp.route('/generate-mock-test', methods=['POST'])
@jwt_required()
def generate_mock_test():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No input data provided"}), 400
        
    subject = data.get('subject_name', 'general').title()
    topic_list = data.get('topic_list', [])
    if not topic_list:
        topic_list = ["Core Concepts"]
        
    topic = topic_list[0]
    difficulty_filter = data.get('difficulty', 'all').lower()
    
    # Generate exact number of questions
    total_count = int(data.get('question_count', 10))
    
    # Ratios for exact count
    mcq_count = max(1, int(total_count * 0.5))
    short_count = max(1, int(total_count * 0.3))
    long_count = total_count - mcq_count - short_count
    if long_count < 0: long_count = 0
    
    # Helper to generate a single question object
    def _gen_q(q_type, idx):
        diff = "medium"
        if difficulty_filter != 'all': diff = difficulty_filter
        else:
            diff_pool = ["easy", "medium", "hard"]
            diff = diff_pool[idx % 3]
            
        prob = 60 + (idx * 5) % 39
        if prob > 85: importance = "🔥 Must Prepare"
        elif prob > 75: importance = "⭐ Important"
        else: importance = "📝 Practice"
        
        q_obj = {
            "question": f"({subject} - {topic}) Q{idx+1}: Detailed {q_type} problem to test your understanding.",
            "correct_answer": f"The correct approach involves identifying key variables and applying the primary rules of {topic}.",
            "explanation": f"This tests synthesis of {topic}. The key is to correctly structure your methodology.",
            "difficulty": diff,
            "importance": importance,
            "exam_probability": f"{prob}%"
        }
        
        if q_type == "MCQ":
            q_obj["options"] = [
                q_obj["correct_answer"],
                "Incorrect distractor option 1",
                "Common misconception option 2",
                "Unrelated concept option 3"
            ]
            
        return q_obj
        
    mcqs = [_gen_q("MCQ", i) for i in range(mcq_count)]
    short_questions = [_gen_q("Short Question", i) for i in range(short_count)]
    long_questions = [_gen_q("Long Question", i) for i in range(long_count)]
    
    # Rank highest priority first for each category
    def rank_sort(q_list):
        def score(q):
            imp = q.get('importance', '')
            prob = int(q.get('exam_probability', '0').replace('%', ''))
            return (0 if 'Must Prepare' in imp else 1 if 'Important' in imp else 2, -prob)
        return sorted(q_list, key=score)
        
    return jsonify({
        "subject": subject,
        "topic_focus": topic,
        "paper": {
            "mcqs": rank_sort(mcqs),
            "short_questions": rank_sort(short_questions),
            "long_questions": rank_sort(long_questions)
        }
    }), 200
