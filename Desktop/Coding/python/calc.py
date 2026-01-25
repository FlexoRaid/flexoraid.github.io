import tkinter as tk
from tkinter import font

class AppleCalculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculator")
        
        # Fenster etwas breiter und höher für Linux-Skalierung
        self.root.geometry("380x600")
        self.root.configure(bg="#000000")
        self.root.resizable(False, False)

        self.expression = ""
        self.display_var = tk.StringVar(value="0")

        # Größere Fonts für bessere Lesbarkeit
        self.display_font = font.Font(family="Helvetica", size=60, weight="normal")
        self.btn_font = font.Font(family="Helvetica", size=22, weight="bold")

        self.setup_ui()

    def setup_ui(self):
        # Display Bereich mit mehr Platz
        display_frame = tk.Frame(self.root, bg="#000000")
        display_frame.pack(side="top", fill="both", expand=True, padx=20, pady=(40, 10))

        lbl = tk.Label(
            display_frame, textvariable=self.display_var, anchor="e",
            bg="#000000", fg="#FFFFFF", font=self.display_font
        )
        lbl.pack(side="bottom", fill="x")

        # Button Bereich
        btn_frame = tk.Frame(self.root, bg="#000000", padx=15, pady=20)
        btn_frame.pack(side="bottom", fill="both")

        # Layout: (Text, Hintergrund, Textfarbe, Row, Col, Columnspan)
        btns = [
            ('AC', '#A5A5A5', 'black', 0, 0, 1), ('+/-', '#A5A5A5', 'black', 0, 1, 1), ('%', '#A5A5A5', 'black', 0, 2, 1), ('÷', '#FF9F0A', 'white', 0, 3, 1),
            ('7', '#333333', 'white', 1, 0, 1), ('8', '#333333', 'white', 1, 1, 1), ('9', '#333333', 'white', 1, 2, 1), ('×', '#FF9F0A', 'white', 1, 3, 1),
            ('4', '#333333', 'white', 2, 0, 1), ('5', '#333333', 'white', 2, 1, 1), ('6', '#333333', 'white', 2, 2, 1), ('-', '#FF9F0A', 'white', 2, 3, 1),
            ('1', '#333333', 'white', 3, 0, 1), ('2', '#333333', 'white', 3, 1, 1), ('3', '#333333', 'white', 3, 2, 1), ('+', '#FF9F0A', 'white', 3, 3, 1),
            ('0', '#333333', 'white', 4, 0, 2), ('.', '#333333', 'white', 4, 2, 1), ('=', '#FF9F0A', 'white', 4, 3, 1)
        ]

        for b_text, b_bg, b_fg, r, c, cs in btns:
            # Erhöhte width/height für Linux-Rendering
            btn_w = 4 if cs == 1 else 9
            
            btn = tk.Button(
                btn_frame, text=b_text, bg=b_bg, fg=b_fg, font=self.btn_font,
                borderwidth=0, highlightthickness=0, activebackground="#555555",
                relief="flat", command=lambda t=b_text: self.on_press(t),
                width=btn_w, height=2
            )
            btn.grid(row=r, column=c, columnspan=cs, padx=5, pady=5, sticky="nsew")

        # Spalten gleichmäßig verteilen
        for i in range(4):
            btn_frame.grid_columnconfigure(i, weight=1)

    def on_press(self, key):
        if key == "AC":
            self.expression = ""
            self.display_var.set("0")
        elif key == "=":
            try:
                calc_expr = self.expression.replace('×', '*').replace('÷', '/')
                result = eval(calc_expr)
                # Ergebnis runden oder als Int anzeigen
                if result == int(result):
                    self.expression = str(int(result))
                else:
                    self.expression = str(round(result, 8))
                self.display_var.set(self.expression)
            except:
                self.display_var.set("Error")
                self.expression = ""
        else:
            if self.display_var.get() == "0" and key != ".":
                self.expression = key
            else:
                self.expression += key
            self.display_var.set(self.expression)

if __name__ == "__main__":
    root = tk.Tk()
    app = AppleCalculator(root)
    root.mainloop()