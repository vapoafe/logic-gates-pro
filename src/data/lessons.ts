import { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'intro',
    title: 'Introduction to Boolean Logic',
    titleEl: 'Εισαγωγή στη Λογική Boole',
    description: 'Discover the foundations of 0 and 1, TRUE and FALSE in digital computing.',
    descriptionEl: 'Μάθε τα βασικά της ψηφιακής λογικής, των τιμών 0 και 1 και την άλγεβρα Boole.',
    difficulty: 'Beginner',
    duration: '6 min',
    icon: '📖',
    category: 'basics',
    contentEl: `
      <h2>Τι είναι η Άλγεβρα Boole;</h2>
      <p>Η άλγεβρα Boole διατυπώθηκε το 1854 από τον Βρετανό μαθηματικό <strong>George Boole</strong>. Αποτελεί το θεμέλιο όλης της σύγχρονης ψηφιακής τεχνολογίας, των επεξεργαστών (CPUs) και των υπολογιστών.</p>
      
      <div class="my-4 p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <h3 class="font-bold text-indigo-700 dark:text-indigo-300">Οι δύο θεμελιώδεις καταστάσεις:</h3>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-700 dark:text-slate-300">
          <li><strong>1 (HIGH / TRUE / Αληθές):</strong> Υψηλή τάση (+5V ή +3.3V), κλειστός διακόπτης, αναμμένη λάμπα.</li>
          <li><strong>0 (LOW / FALSE / Ψευδές):</strong> Χαμηλή τάση (0V - Γείωση), ανοιχτός διακόπτης, σβηστή λάμπα.</li>
        </ul>
      </div>

      <h3>Γιατί χρησιμοποιούμε δυαδική λογική;</h3>
      <p>Τα τρανζίστορ μέσα σε έναν μικροεπεξεργαστή λειτουργούν ως ταχύτατοι ηλεκτρονικοί διακόπτες που μπορούν να είναι είτε ενεργοποιημένοι (1) είτε απενεργοποιημένοι (0). Συνδυάζοντας εκατομμύρια τέτοιους διακόπτες σε <strong>λογικές πύλες</strong>, μπορούμε να εκτελέσουμε αριθμητικές πράξεις, να αποθηκεύσουμε δεδομένα και να τρέξουμε οποιοδήποτε πρόγραμμα.</p>
    `,
    contentEn: `
      <h2>What is Boolean Algebra?</h2>
      <p>Formulated by British mathematician <strong>George Boole</strong> in 1854, Boolean algebra is the mathematical foundation of all digital electronics, CPUs, and computers.</p>
      
      <div class="my-4 p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <h3 class="font-bold text-indigo-700 dark:text-indigo-300">The Two Fundamental States:</h3>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-700 dark:text-slate-300">
          <li><strong>1 (HIGH / TRUE):</strong> High voltage (+5V / +3.3V), closed switch, light ON.</li>
          <li><strong>0 (LOW / FALSE):</strong> Zero voltage (0V Ground), open switch, light OFF.</li>
        </ul>
      </div>

      <h3>Why Binary Logic?</h3>
      <p>Transistors inside modern processors act as ultra-fast switches that are either ON (1) or OFF (0). By chaining them into <strong>logic gates</strong>, computers calculate math, store memory, and execute algorithms.</p>
    `,
  },
  {
    id: 'and-gate',
    title: 'AND Gate (Conjunction)',
    titleEl: 'AND Πύλη (Σύζευξη)',
    description: 'Output is 1 ONLY when ALL inputs are 1. The digital "AND".',
    descriptionEl: 'Η έξοδος είναι 1 ΜΟΝΟ όταν ΟΛΕΣ οι είσοδοι είναι 1.',
    difficulty: 'Beginner',
    duration: '5 min',
    icon: '🔗',
    category: 'gates',
    gateDemoType: 'AND',
    truthTable: {
      headers: ['A', 'B', 'A · B (Έξοδος)'],
      rows: [
        [0, 0, 0],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
    },
    contentEl: `
      <h2>AND Πύλη (Λογική Σύζευξη)</h2>
      <p>Η πύλη AND έχει 2 ή περισσότερες εισόδους και 1 έξοδο. Δίνει έξοδο <strong>1</strong> μόνο όταν <strong>όλες</strong> οι είσοδοί της είναι <strong>1</strong>.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Μαθηματικός Συμβολισμός: Y = A · B &nbsp;ή&nbsp; Y = A ∧ B</p>
      </div>

      <h3>Αναλογία με Ηλεκτρικό Κύκλωμα</h3>
      <p>Φαντάσου δύο διακόπτες συνδεδεμένους <strong>σε σειρά</strong> με μια λάμπα:</p>
      <ul>
        <li>Για να ανάψει η λάμπα, πρέπει ο διακόπτης A <strong>ΚΑΙ</strong> ο διακόπτης B να είναι πατημένοι (1).</li>
        <li>Αν έστω ένας διακόπτης είναι ανοιχτός (0), το ρεύμα διακόπτεται και η λάμπα μένει σβηστή (0).</li>
      </ul>

      <h3>Βασικές Ιδιότητες AND:</h3>
      <ul>
        <li><code>A · 0 = 0</code> (Μηδενισμός)</li>
        <li><code>A · 1 = A</code> (Ταυτότητα)</li>
        <li><code>A · A = A</code> (Ταυτοδυναμία)</li>
        <li><code>A · ¯A = 0</code> (Συμπλήρωμα / Αντίφαση)</li>
      </ul>
    `,
    contentEn: `
      <h2>AND Gate (Logical Conjunction)</h2>
      <p>The AND gate outputs <strong>1</strong> if and only if <strong>all</strong> of its inputs are <strong>1</strong>.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Formula: Y = A · B &nbsp;or&nbsp; Y = A ∧ B</p>
      </div>

      <h3>Series Circuit Analogy</h3>
      <p>Think of two switches connected in <strong>series</strong> with a bulb:</p>
      <ul>
        <li>To turn the light on, Switch A <strong>AND</strong> Switch B must be closed (1).</li>
        <li>If any switch is open (0), current stops and the light stays OFF (0).</li>
      </ul>

      <h3>Key Boolean Identities:</h3>
      <ul>
        <li><code>A · 0 = 0</code> (Null element)</li>
        <li><code>A · 1 = A</code> (Identity)</li>
        <li><code>A · A = A</code> (Idempotence)</li>
        <li><code>A · ¯A = 0</code> (Complement)</li>
      </ul>
    `,
  },
  {
    id: 'or-gate',
    title: 'OR Gate (Disjunction)',
    titleEl: 'OR Πύλη (Διάζευξη)',
    description: 'Output is 1 if AT LEAST ONE input is 1.',
    descriptionEl: 'Η έξοδος είναι 1 όταν ΤΟΥΛΑΧΙΣΤΟΝ ΜΙΑ είσοδος είναι 1.',
    difficulty: 'Beginner',
    duration: '5 min',
    icon: '🔓',
    category: 'gates',
    gateDemoType: 'OR',
    truthTable: {
      headers: ['A', 'B', 'A + B (Έξοδος)'],
      rows: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
    },
    contentEl: `
      <h2>OR Πύλη (Λογική Διάζευξη)</h2>
      <p>Η πύλη OR δίνει έξοδο <strong>1</strong> όταν <strong>τουλάχιστον μία</strong> από τις εισόδους της είναι <strong>1</strong>. Δίνει 0 μόνο όταν όλες οι είσοδοι είναι 0.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Μαθηματικός Συμβολισμός: Y = A + B &nbsp;ή&nbsp; Y = A ∨ B</p>
      </div>

      <h3>Αναλογία με Παράλληλο Κύκλωμα</h3>
      <p>Φαντάσου δύο διακόπτες συνδεδεμένους <strong>παράλληλα</strong>:</p>
      <ul>
        <li>Αν πατηθεί ο διακόπτης A <strong>Ή</strong> ο διακόπτης B (ή και οι δύο), το ρεύμα βρίσκει δρόμο και η λάμπα ανάβει (1).</li>
        <li>Η λάμπα σβήνει μόνο αν και οι δύο διακόπτες είναι ανοιχτοί (0).</li>
      </ul>

      <h3>Βασικές Ιδιότητες OR:</h3>
      <ul>
        <li><code>A + 0 = A</code> (Ταυτότητα)</li>
        <li><code>A + 1 = 1</code> (Μέγιστο στοιχείο)</li>
        <li><code>A + A = A</code> (Ταυτοδυναμία)</li>
        <li><code>A + ¯A = 1</code> (Ταυτολογία / Συμπλήρωμα)</li>
      </ul>
    `,
    contentEn: `
      <h2>OR Gate (Logical Disjunction)</h2>
      <p>The OR gate outputs <strong>1</strong> if <strong>at least one</strong> input is <strong>1</strong>. It only outputs 0 when all inputs are 0.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Formula: Y = A + B &nbsp;or&nbsp; Y = A ∨ B</p>
      </div>

      <h3>Parallel Circuit Analogy</h3>
      <p>Two switches in <strong>parallel</strong>:</p>
      <ul>
        <li>If Switch A <strong>OR</strong> Switch B is closed, electricity flows and the bulb lights up (1).</li>
        <li>The bulb turns off only when both switches are open (0).</li>
      </ul>
    `,
  },
  {
    id: 'not-gate',
    title: 'NOT Gate (Inverter)',
    titleEl: 'NOT Πύλη (Αντιστροφέας)',
    description: 'Inverts the binary state: 0 becomes 1, and 1 becomes 0.',
    descriptionEl: 'Αντιστρέφει το σήμα εισόδου: το 0 γίνεται 1 και το 1 γίνεται 0.',
    difficulty: 'Beginner',
    duration: '4 min',
    icon: '🔄',
    category: 'gates',
    gateDemoType: 'NOT',
    truthTable: {
      headers: ['A', '¯A (Έξοδος)'],
      rows: [
        [0, 1],
        [1, 0],
      ],
    },
    contentEl: `
      <h2>NOT Πύλη (Αντιστροφέας / Inverter)</h2>
      <p>Η πύλη NOT έχει <strong>1 είσοδο</strong> και <strong>1 έξοδο</strong>. Η λειτουργία της είναι απλή: παράγει το συμπλήρωμα (αντίθετο) της εισόδου.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Μαθηματικός Συμβολισμός: Y = ¯A &nbsp;ή&nbsp; Y = ¬A &nbsp;ή&nbsp; Y = A'</p>
      </div>

      <h3>Ιδιότητες NOT:</h3>
      <ul>
        <li><code>¯(¯A) = A</code> (Διπλή άρνηση / Involutive property)</li>
        <li>Σχηματικά αναγνωρίζεται από ένα τρίγωνο με ένα μικρό κυκλάκι (bubble) στην έξοδο. Το κυκλάκι δηλώνει πάντοτε αναστροφή λογικού επιπέδου!</li>
      </ul>
    `,
    contentEn: `
      <h2>NOT Gate (Logic Inverter)</h2>
      <p>The NOT gate has <strong>one input</strong> and <strong>one output</strong>. It inverts the input signal to its logical complement.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Formula: Y = ¯A &nbsp;or&nbsp; Y = ¬A &nbsp;or&nbsp; Y = A'</p>
      </div>

      <h3>Double Negation:</h3>
      <ul>
        <li><code>¯(¯A) = A</code></li>
        <li>The small bubble on logic schematics always represents signal inversion!</li>
      </ul>
    `,
  },
  {
    id: 'nand-gate',
    title: 'NAND Gate (Universal Gate)',
    titleEl: 'NAND Πύλη (Καθολική Πύλη)',
    description: 'NOT-AND: Outputs 0 only when both inputs are 1. Can build ALL circuits!',
    descriptionEl: 'NOT-AND: Δίνει 0 μόνο όταν και οι δύο είσοδοι είναι 1. Θεμελιώδης πύλη!',
    difficulty: 'Intermediate',
    duration: '6 min',
    icon: '⊼',
    category: 'gates',
    gateDemoType: 'NAND',
    truthTable: {
      headers: ['A', 'B', '¯(A · B)'],
      rows: [
        [0, 0, 1],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
      ],
    },
    contentEl: `
      <h2>NAND Πύλη (NOT-AND)</h2>
      <p>Η πύλη NAND είναι η σύνθεση μιας πύλης AND που ακολουθείται από μια NOT. Δίνει έξοδο <strong>0</strong> αποκλειστικά και μόνο όταν <strong>όλες</strong> οι είσοδοι είναι 1.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Μαθηματικός Συμβολισμός: Y = ¯(A · B) &nbsp;ή&nbsp; Y = A ⊼ B</p>
      </div>

      <h3>Γιατί θεωρείται "Universal Gate" (Καθολική);</h3>
      <p>Η πύλη NAND είναι καθολική επειδή <strong>οποιοδήποτε</strong> λογικό κύκλωμα (AND, OR, NOT, XOR, Flip-Flops, CPUs) μπορεί να κατασκευαστεί χρησιμοποιώντας <em>μόνο</em> πύλες NAND! Αυτό απλοποιεί δραματικά την παραγωγή ολοκληρωμένων κυκλωμάτων (chips) από πυρίτιο.</p>
    `,
    contentEn: `
      <h2>NAND Gate (Universal Gate)</h2>
      <p>NAND is equivalent to an AND gate followed by a NOT gate. It outputs <strong>0</strong> only when all inputs are 1.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Formula: Y = ¯(A · B)</p>
      </div>

      <h3>Universal Gate Property</h3>
      <p>NAND is functionally complete: <strong>every</strong> boolean function and digital logic circuit can be built exclusively out of NAND gates.</p>
    `,
  },
  {
    id: 'nor-gate',
    title: 'NOR Gate (Universal Gate)',
    titleEl: 'NOR Πύλη (Καθολική Πύλη)',
    description: 'NOT-OR: Outputs 1 only when BOTH inputs are 0.',
    descriptionEl: 'NOT-OR: Δίνει έξοδο 1 μόνο όταν ΚΑΙ ΟΙ ΔΥΟ είσοδοι είναι 0.',
    difficulty: 'Intermediate',
    duration: '6 min',
    icon: '⊽',
    category: 'gates',
    gateDemoType: 'NOR',
    truthTable: {
      headers: ['A', 'B', '¯(A + B)'],
      rows: [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 0],
      ],
    },
    contentEl: `
      <h2>NOR Πύλη (NOT-OR)</h2>
      <p>Η πύλη NOR παράγει το αντίθετο της OR. Δίνει έξοδο <strong>1</strong> μόνο όταν <strong>όλες</strong> οι είσοδοί της είναι <strong>0</strong>.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Μαθηματικός Συμβολισμός: Y = ¯(A + B) &nbsp;ή&nbsp; Y = A ⊽ B</p>
      </div>

      <h3>Καθολικότητα (Universality)</h3>
      <p>Όπως και η NAND, η NOR είναι επίσης <strong>καθολική πύλη</strong>. Για παράδειγμα, αν συνδέσουμε τις δύο εισόδους μιας NOR μαζί, παίρνουμε μια NOT πύλη: <code>¯(A + A) = ¯A</code>.</p>
    `,
    contentEn: `
      <h2>NOR Gate (NOT-OR)</h2>
      <p>NOR inverts the result of an OR gate. It outputs <strong>1</strong> only when both inputs are 0.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Formula: Y = ¯(A + B)</p>
      </div>
    `,
  },
  {
    id: 'xor-gate',
    title: 'XOR Gate (Exclusive OR)',
    titleEl: 'XOR Πύλη (Αποκλειστική Διάζευξη)',
    description: 'Outputs 1 when inputs are DIFFERENT. Essential for binary addition.',
    descriptionEl: 'Δίνει 1 όταν οι είσοδοι είναι ΔΙΑΦΟΡΕΤΙΚΕΣ. Βασικό στοιχείο για πρόσθεση!',
    difficulty: 'Intermediate',
    duration: '7 min',
    icon: '⊕',
    category: 'gates',
    gateDemoType: 'XOR',
    truthTable: {
      headers: ['A', 'B', 'A ⊕ B'],
      rows: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
      ],
    },
    contentEl: `
      <h2>XOR Πύλη (Exclusive OR)</h2>
      <p>Η πύλη XOR (Αποκλειστικό Ή) δίνει έξοδο <strong>1</strong> όταν <strong>ακριβώς μία</strong> από τις εισόδους είναι 1. Όταν οι είσοδοι είναι ίδιες (0,0 ή 1,1), η έξοδος είναι <strong>0</strong>.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Τύπος: A ⊕ B = (A · ¯B) + (¯A · B)</p>
      </div>

      <h3>Εφαρμογές της XOR:</h3>
      <ul>
        <li><strong>Δυαδική Πρόσθεση (Adders):</strong> Το άθροισμα 1-bit είναι ακριβώς <code>A ⊕ B</code> (0+0=0, 0+1=1, 1+0=1, 1+1=0 με κρατούμενο 1).</li>
        <li><strong>Έλεγχος Ισοτιμίας (Parity Check) & Κρυπτογραφία:</strong> Χρησιμοποιείται για ανίχνευση λαθών σε μεταδόσεις δεδομένων.</li>
      </ul>
    `,
    contentEn: `
      <h2>XOR Gate (Exclusive OR)</h2>
      <p>The XOR gate outputs <strong>1</strong> if the inputs are different, and <strong>0</strong> if they are the same.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Formula: A ⊕ B = (A · ¯B) + (¯A · B)</p>
      </div>

      <h3>Applications:</h3>
      <ul>
        <li><strong>Binary Adders:</strong> 1-bit sum bit calculation.</li>
        <li><strong>Parity Checkers & Encryption:</strong> Error detection and stream ciphers.</li>
      </ul>
    `,
  },
  {
    id: 'xnor-gate',
    title: 'XNOR Gate (Equivalence)',
    titleEl: 'XNOR Πύλη (Ισοδυναμία)',
    description: 'Outputs 1 when inputs are IDENTICAL. Digital comparator.',
    descriptionEl: 'Δίνει 1 όταν οι είσοδοι είναι ΙΔΙΕΣ. Χρησιμεύει ως συγκριτής ισότητας.',
    difficulty: 'Intermediate',
    duration: '5 min',
    icon: '⊙',
    category: 'gates',
    gateDemoType: 'XNOR',
    truthTable: {
      headers: ['A', 'B', '¯(A ⊕ B)'],
      rows: [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
    },
    contentEl: `
      <h2>XNOR Πύλη (Exclusive NOR)</h2>
      <p>Η πύλη XNOR είναι ο αντιστροφέας της XOR. Δίνει έξοδο <strong>1</strong> όταν οι είσοδοι είναι <strong>ίσες μεταξύ τους</strong> (0 και 0, ή 1 και 1).</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Τύπος: Y = ¯(A ⊕ B) = (A · B) + (¯A · ¯B)</p>
      </div>

      <p>Χρησιμοποιείται συχνά σε κυκλώματα <strong>ψηφιακής σύγκρισης</strong> για να ελέγξει αν δύο αριθμοί ή bits είναι ίσα.</p>
    `,
    contentEn: `
      <h2>XNOR Gate (Logical Equivalence)</h2>
      <p>The XNOR gate outputs <strong>1</strong> when both inputs are identical (both 0 or both 1). It acts as a digital equality tester.</p>
      
      <div class="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">Formula: Y = (A · B) + (¯A · ¯B)</p>
      </div>
    `,
  },
  {
    id: 'demorgan',
    title: "De Morgan's Laws & Simplification",
    titleEl: 'Νόμοι De Morgan & Απλοποίηση Boole',
    description: 'Learn the two crucial theorems that transform complex logic expressions.',
    descriptionEl: 'Μάθε τους 2 κρίσιμους νόμους που μετατρέπουν και απλοποιούν λογικές εκφράσεις.',
    difficulty: 'Advanced',
    duration: '10 min',
    icon: '🔀',
    category: 'boolean',
    contentEl: `
      <h2>Νόμοι De Morgan</h2>
      <p>Ο Augustus De Morgan ανακάλυψε δύο θεμελιώδεις ταυτότητες που συνδέουν τις πράξεις AND, OR και NOT.</p>
      
      <div class="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl">
          <h4 class="font-bold text-emerald-800 dark:text-emerald-300">1ος Νόμος De Morgan</h4>
          <p class="font-mono text-xl my-2 text-emerald-950 dark:text-emerald-100 font-extrabold">¯(A · B) = ¯A + ¯B</p>
          <p class="text-sm text-slate-600 dark:text-slate-300">Η άρνηση του γινομένου (NAND) ισούται με το άθροισμα των αρνήσεων.</p>
        </div>
        <div class="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700 rounded-xl">
          <h4 class="font-bold text-blue-800 dark:text-blue-300">2ος Νόμος De Morgan</h4>
          <p class="font-mono text-xl my-2 text-blue-950 dark:text-blue-100 font-extrabold">¯(A + B) = ¯A · ¯B</p>
          <p class="text-sm text-slate-600 dark:text-slate-300">Η άρνηση του αθροίσματος (NOR) ισούται με το γινόμενο των αρνήσεων.</p>
        </div>
      </div>

      <h3>Σημαντικοί Κανόνες Απλοποίησης:</h3>
      <ul>
        <li><strong>Νόμος Απορρόφησης (Absorption):</strong> <code>A + A · B = A</code> και <code>A · (A + B) = A</code></li>
        <li><strong>Επιμεριστικός Νόμος (Distributive):</strong> <code>A · (B + C) = (A · B) + (A · C)</code> και <code>A + (B · C) = (A + B) · (A + C)</code></li>
        <li><strong>Εξουδετέρωση Συμπληρώματος:</strong> <code>A + ¯A · B = A + B</code></li>
      </ul>
    `,
    contentEn: `
      <h2>De Morgan's Laws</h2>
      <p>Augustus De Morgan discovered two core transformation theorems between AND, OR, and NOT operations.</p>
      
      <div class="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl">
          <h4 class="font-bold text-emerald-800 dark:text-emerald-300">1st De Morgan Law</h4>
          <p class="font-mono text-xl my-2 text-emerald-950 dark:text-emerald-100 font-extrabold">¯(A · B) = ¯A + ¯B</p>
          <p class="text-sm text-slate-600 dark:text-slate-300">The negation of a conjunction equals the disjunction of the negations.</p>
        </div>
        <div class="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700 rounded-xl">
          <h4 class="font-bold text-blue-800 dark:text-blue-300">2nd De Morgan Law</h4>
          <p class="font-mono text-xl my-2 text-blue-950 dark:text-blue-100 font-extrabold">¯(A + B) = ¯A · ¯B</p>
          <p class="text-sm text-slate-600 dark:text-slate-300">The negation of a disjunction equals the conjunction of the negations.</p>
        </div>
      </div>
    `,
  },
  {
    id: 'adders',
    title: 'Half Adder & Full Adder Circuits',
    titleEl: 'Ημιαθροιστής & Πλήρης Αθροιστής',
    description: 'Learn how logic gates combine to do real mathematical addition.',
    descriptionEl: 'Δες πώς οι πύλες συνδυάζονται για να κάνουν πραγματική αριθμητική πρόσθεση.',
    difficulty: 'Advanced',
    duration: '8 min',
    icon: '➕',
    category: 'circuits',
    contentEl: `
      <h2>Ο Ημιαθροιστής (Half Adder)</h2>
      <p>Ο ημιαθροιστής προσθέτει δύο μονοψήφιους δυαδικούς αριθμούς A και B. Παράγει δύο εξόδους:</p>
      <ul>
        <li><strong>Sum (Άθροισμα S):</strong> Υπολογίζεται από μια πύλη <code>XOR: S = A ⊕ B</code></li>
        <li><strong>Carry (Κρατούμενο C):</strong> Υπολογίζεται από μια πύλη <code>AND: C = A · B</code></li>
      </ul>

      <div class="my-4 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl">
        <h4 class="font-bold text-amber-800 dark:text-amber-300">Πίνακας Πρόσθεσης Half Adder:</h4>
        <p>0 + 0 = S: 0, C: 0</p>
        <p>0 + 1 = S: 1, C: 0</p>
        <p>1 + 0 = S: 1, C: 0</p>
        <p>1 + 1 = S: 0, C: 1 (δηλαδή δυαδικό 10₂ = δεκαδικό 2!)</p>
      </div>

      <p>Μπορείτε να δοκιμάσετε αυτό το κύκλωμα έτοιμο στον <strong>Σχεδιαστή Κυκλωμάτων (Circuit Designer)</strong>!</p>
    `,
    contentEn: `
      <h2>The Half Adder</h2>
      <p>A half adder adds two single binary bits A and B to produce a Sum (S) and Carry (C):</p>
      <ul>
        <li><strong>Sum (S):</strong> <code>S = A ⊕ B</code> (XOR gate)</li>
        <li><strong>Carry (C):</strong> <code>C = A · B</code> (AND gate)</li>
      </ul>
    `,
  },
];
