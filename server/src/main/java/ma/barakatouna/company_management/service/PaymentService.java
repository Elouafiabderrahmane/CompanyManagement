package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.PaymentDTO;

import java.util.List;

public interface PaymentService {

    List<PaymentDTO> findAll();

    PaymentDTO get(Long id);

    Long create(PaymentDTO paymentDTO);

    void update(Long id, PaymentDTO paymentDTO);

    void delete(Long id);

    boolean projectExists(Long id);
}
