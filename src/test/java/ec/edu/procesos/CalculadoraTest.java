package ec.edu.procesos;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculadoraTest {
    private final Calculadora calculadora = new Calculadora();

    @Test
    void sumaDosNumeros() {
        assertEquals(8, calculadora.sumar(5, 3));
    }

    @Test
    void restaDosNumeros() {
        assertEquals(2, calculadora.restar(5, 3));
    }

    @Test
    void sumaNumerosNegativos() {
        assertEquals(-5, calculadora.sumar(-2, -3));
    }
}
