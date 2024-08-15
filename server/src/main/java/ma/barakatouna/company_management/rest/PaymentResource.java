package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import ma.barakatouna.company_management.entities.Payment;
import ma.barakatouna.company_management.model.PaymentDTO;
import ma.barakatouna.company_management.model.Type;
import ma.barakatouna.company_management.service.PaymentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@CrossOrigin ("*")
@RequestMapping(value = "/api/payments", produces = MediaType.APPLICATION_JSON_VALUE)
public class PaymentResource {

    private final PaymentService paymentService;

    public PaymentResource(final PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(paymentService.get(id));
    }
    @PostMapping
    public ResponseEntity<Long> createPayment(@RequestParam("time") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate time,
                                              @RequestParam("type") Type type,
                                              @RequestParam("amount") Double amount,
                                              @RequestParam(value = "project", required = false) Long projectId,
                                              @RequestParam(value = "material", required = false) Long materialId,
                                              @RequestParam(value = "employer", required = false) Long employerId) {

        Payment payment = paymentService.createPayment(time, type, amount, projectId, materialId, employerId);
        return new ResponseEntity<>(payment.getId(), HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Long> updatePayment(@PathVariable(name = "id") final Long id,
                                              @RequestBody @Valid final PaymentDTO paymentDTO) {
        paymentService.update(id, paymentDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deletePayment(@PathVariable(name = "id") final Long id) {
        paymentService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
