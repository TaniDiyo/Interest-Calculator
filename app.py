from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        
        principal = float(data.get('principal', 0))
        rate = float(data.get('rate', 0))
        time = float(data.get('time', 0))
        
        if principal < 0 or rate < 0 or time < 0:
            return jsonify({'error': 'Values must be non-negative'}), 400
            
        # Calculate Simple Interest: (P * R * T) / 100
        simple_interest = (principal * rate * time) / 100
        total_si_amount = principal + simple_interest
        
        # Calculate Compound Interest: P * (1 + R/100)^T - P
        amount_ci = principal * ((1 + rate / 100) ** time)
        compound_interest = amount_ci - principal
        total_ci_amount = amount_ci
        
        return jsonify({
            'success': True,
            'simple_interest': round(simple_interest, 2),
            'total_si_amount': round(total_si_amount, 2),
            'compound_interest': round(compound_interest, 2),
            'total_ci_amount': round(total_ci_amount, 2)
        })
        
    except ValueError:
        return jsonify({'error': 'Invalid input. Please provide numbers.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
