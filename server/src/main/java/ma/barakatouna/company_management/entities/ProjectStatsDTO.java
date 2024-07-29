package ma.barakatouna.company_management.entities;

import java.util.List;

public class ProjectStatsDTO {
    private List<String> categories;
    private List<Integer> data;

    // Getters and setters
    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public List<Integer> getData() {
        return data;
    }

    public void setData(List<Integer> data) {
        this.data = data;
    }
}
