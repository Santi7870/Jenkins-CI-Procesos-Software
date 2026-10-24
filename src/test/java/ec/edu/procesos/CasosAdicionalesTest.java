package ec.edu.procesos;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class CasosAdicionalesTest {
    private final Calculadora calculadora = new Calculadora();

    @Test
    void sumaConCero() {
        assertEquals(7, calculadora.sumar(7, 0));
    }

    @Test
    void restaConNegativos() {
        assertEquals(-2, calculadora.restar(-5, -3));
    }
}
