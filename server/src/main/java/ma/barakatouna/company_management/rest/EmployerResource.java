package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.model.EmployerDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.service.EmployerService;
import ma.barakatouna.company_management.util.NotFoundException;
import ma.barakatouna.company_management.util.ReferencedException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


@RestController
@CrossOrigin ("*")

@RequestMapping(value = "/api/employers", produces = MediaType.APPLICATION_JSON_VALUE)
public class EmployerResource {

    private final EmployerService employerService;
    private final EmployerRepository employerRepository;

    public EmployerResource(final EmployerService employerService, EmployerRepository employerRepository) {
        this.employerService = employerService;
        this.employerRepository = employerRepository;
    }

    @GetMapping
    public ResponseEntity<List<EmployerDTO>> getAllEmployers() {
        return ResponseEntity.ok(employerService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployerDTO> getEmployer(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(employerService.get(id));
    }

    @PostMapping(value = "/api/employers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiResponse(ref = "201")
    public ResponseEntity<Long> createEmployer(
            @RequestParam("image") MultipartFile image,
            @RequestParam("name") String name,
            @RequestParam("phone") String phone,
            @RequestParam("cin") String cin,
            @RequestParam("email") String email,
            @RequestParam("adress") String adress,
            @RequestParam("hireDate") LocalDate hireDate,
            @RequestParam("birthDate") LocalDate birthDate
    ) throws IOException {

        // Create directory for storing images if it does not exist
        Path path = Paths.get(System.getProperty("user.home"), "employers-images");
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        // Generate unique image name
        String imageId = UUID.randomUUID().toString();
        String imageName = imageId + "-" + image.getOriginalFilename();
        Path imagePath = Paths.get(System.getProperty("user.home"), "employers-images", imageName);

        // Save the image to the specified directory
        Files.copy(image.getInputStream(), imagePath);

        // Map request parameters to Employer entity
        Employer employer = new Employer();
        employer.setName(name);
        employer.setPhone(phone);
        employer.setCin(cin);
        employer.setEmail(email);
        employer.setAdress(adress);
        employer.setHireDate(hireDate);
        employer.setBirthDate(birthDate);
        employer.setUrl(imagePath.toUri().toString());

        // Assuming you have associations properly handled in your service layer
        // Set materials, user, etc.

        // Save the Employer entity
        employer = employerRepository.save(employer);

        // Return the ID of the created employer
        return new ResponseEntity<>(employer.getId(), HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}/image" , produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public byte[] getEmployerImage(@PathVariable(name = "id") final Long id) throws IOException {
        Employer employer = employerRepository.findById(id).orElseThrow(NotFoundException::new);
        String imagePath = employer.getUrl();
        return Files.readAllBytes(Path.of(URI.create(imagePath)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateEmployer(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final EmployerDTO employerDTO) {
        employerService.update(id, employerDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteEmployer(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = employerService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        employerService.delete(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/salaries/{salaryId}")
    public ResponseEntity<EmployerDTO> getEmployerBySalaryId(@PathVariable Long salaryId) {
        EmployerDTO employer = employerService.getEmployerBySalaryId(salaryId);
        return ResponseEntity.ok(employer);
    }
    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<List<EmployerDTO>> getEmployersByTaskId(@PathVariable Long taskId) {
        List<EmployerDTO> employers = employerService.getEmployersByTaskId(taskId);
        return ResponseEntity.ok(employers);
    }

    @GetMapping("/payments/{paymentId}")
    public ResponseEntity<EmployerDTO> getEmployerByPaymentId(@PathVariable Long paymentId) {
        EmployerDTO employer = employerService.getEmployerByPaymentId(paymentId);
        return ResponseEntity.ok(employer);
    }

    @GetMapping("/materials/{materialId}")
    public ResponseEntity<List<EmployerDTO>> getAllMaterialsForEmployer(@PathVariable Long materialId) {
        List<EmployerDTO> employers = employerService.getAllEmployersByMaterial(materialId);
        return ResponseEntity.ok(employers);
    }


    @GetMapping("/projects/{projectId}")
    public ResponseEntity<List<EmployerDTO>> getAllEmployersByProjectId(@PathVariable Long projectId) {
        List<EmployerDTO> employers = employerService.findAllByProjectId(projectId);
        return ResponseEntity.ok(employers);
    }
}
